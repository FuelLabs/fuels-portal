import type { Locator } from '@playwright/test';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import type { BigNumberish, WalletUnlocked } from 'fuels';
import { Wallet, bn, Provider, format } from 'fuels';
import type { HDAccount } from 'viem';
import { createPublicClient, getContract, http } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';
import type { PublicClient } from 'wagmi';

import { ERC_20 } from '../../src/systems/Chains/eth/contracts/Erc20';
import {
  getByAriaLabel,
  getButtonByText,
  walletSetup,
  walletApprove,
  walletConnect,
  hasText,
} from '../commons';
import { ETH_MNEMONIC, FUEL_MNEMONIC } from '../mocks';

import { test, expect } from './fixtures';
import { closeTransactionPopup } from './utils/bridge';

import '../../load.envs';

const { FUEL_PROVIDER_URL, VITE_ETH_ERC20 } = process.env;

const ASSET_ID =
  '0x9507512b43cae331c49e86eb76c52cb5fad8a4ec5b811efcbb499b56816fc18a';

test.describe('Bridge', () => {
  let client: PublicClient;
  let account: HDAccount;
  let fuelWallet: WalletUnlocked;
  let erc20Contract;

  test.beforeEach(async ({ context, extensionId, page }) => {
    await walletSetup(context, extensionId, page);
    client = createPublicClient({
      chain: foundry,
      transport: http(),
    });
    account = mnemonicToAccount(ETH_MNEMONIC);
    const fuelProvider = await Provider.create(FUEL_PROVIDER_URL);
    fuelWallet = Wallet.fromMnemonic(FUEL_MNEMONIC, fuelProvider);
    await page.goto('/');
  });

  test('e2e', async ({ context, page }) => {
    await test.step('Check if fuel is available', async () => {
      const hasFuel = await page.evaluate(() => {
        return typeof window.fuel === 'object';
      });
      expect(hasFuel).toBeTruthy();
      await page.bringToFront();
    });

    let bridgePage: Locator;
    await test.step('Connect to metamask', async () => {
      await page.bringToFront();
      // Go to the bridge page
      bridgePage = page.locator('[role="link"]').getByText('Bridge');
      await bridgePage.click();

      // Connect metamask
      const connectKitButton = getByAriaLabel(page, 'Connect Ethereum Wallet');
      await connectKitButton.click();
      const metamaskConnect = getButtonByText(page, 'Metamask');
      await metamaskConnect.click();
      await metamask.acceptAccess();
    });

    await test.step('Connect to Fuel', async () => {
      // Connect fuel
      const connectFuel = getByAriaLabel(page, 'Connect Fuel Wallet');
      await connectFuel.click();
      await getByAriaLabel(page, 'Connect to Fuel Wallet').click();
      await walletConnect(context);
    });

    await test.step('Deposit ETH to Fuel', async () => {
      const depositInput = page.locator('input');
      await depositInput.fill('10');

      const depositButton = getByAriaLabel(page, 'Deposit');
      await depositButton.click();

      // Timeout needed until https://github.com/Synthetixio/synpress/issues/795 is fixed
      await page.waitForTimeout(2000);
      await metamask.confirmTransaction();

      await page.screenshot({ fullPage: true, path: 'temp.png' });

      // Check steps
      await page.locator(':nth-match(:text("Done"), 4)').waitFor();

      await closeTransactionPopup(page);
    });

    await test.step('Faucet TKN', async () => {
      erc20Contract = getContract({
        abi: ERC_20.abi,
        address: VITE_ETH_ERC20 as `0x${string}`,
        publicClient: client,
      });

      const preFaucetBalance = (await erc20Contract.read.balanceOf([
        account.address,
      ])) as BigNumberish;

      const coinSelector = getByAriaLabel(page, 'Coin Selector');
      await coinSelector.click();

      const faucetButton = getByAriaLabel(page, 'AddEthAsset');
      await faucetButton.click();

      // Timeout needed until https://github.com/Synthetixio/synpress/issues/795 is fixed
      await page.waitForTimeout(2000);
      await metamask.confirmTransaction();

      const postFaucetBalance = await erc20Contract.read.balanceOf([
        account.address,
      ]);
      expect(String(postFaucetBalance)).toBe(
        bn(preFaucetBalance).add(bn.parseUnits('1000000', 18)).toString()
      );

      const tknButton = page.getByRole('button', { name: 'TKN' });
      await tknButton.click();

      await hasText(
        page,
        `Balance: ${format(postFaucetBalance as BigNumberish, {
          units: 18,
          precision: 3,
        })}`
      );
    });

    await test.step('Deposit TKN to Fuel', async () => {
      const preDepositBalanceFuel = await fuelWallet.getBalance(ASSET_ID);
      const preDepositBalanceEth = await erc20Contract.read.balanceOf([
        account.address,
      ]);

      // Deposit asset
      const depositAmount = '1.12345';
      const depositInput = page.locator('input');
      await depositInput.fill(depositAmount);
      const depositButton = getByAriaLabel(page, 'Deposit');
      await depositButton.click();

      // Timeout needed until https://github.com/Synthetixio/synpress/issues/795 is fixed
      await page.waitForTimeout(7500);
      await metamask.confirmPermissionToSpend();
      await metamask.confirmTransaction();

      // Check steps
      await page.locator(':nth-match(:text("Done"), 2)').waitFor();

      const postDepositBalanceEth = await erc20Contract.read.balanceOf([
        account.address,
      ]);

      expect(
        parseFloat(
          bn(preDepositBalanceEth.toString())
            .sub(postDepositBalanceEth.toString())
            .format({ precision: 6, units: 18 })
        )
      ).toBeCloseTo(parseFloat(depositAmount));

      // check the popup is correct
      const transactionID = (
        await getByAriaLabel(page, 'Transaction ID').innerText()
      ).trim();
      const assetAmount = getByAriaLabel(page, 'Asset amount');
      expect((await assetAmount.innerHTML()).trim()).toBe(depositAmount);
      await closeTransactionPopup(page);

      const transactionList = page.locator('button').getByText('History');
      await transactionList.click();

      // check the transaction is there
      const depositLocator = getByAriaLabel(
        page,
        `Transaction ID: ${transactionID}`
      );
      // Check that action required is shown
      const actionRequiredLocator = depositLocator.getByText('Action Required');
      await actionRequiredLocator.innerText();
      // check if has correct asset amount
      const assetAmountLocator = depositLocator.getByText(
        `${depositAmount} TKN`
      );
      await assetAmountLocator.innerText();

      // Confirm the transaction on the fuel side
      await depositLocator.click();
      const confirmTransactionButton = page.getByRole('button', {
        name: 'Confirm Transaction',
      });
      await confirmTransactionButton.click();
      await walletApprove(context);

      // Check steps
      await page.locator(':nth-match(:text("Done"), 4)').waitFor();
      await closeTransactionPopup(page);

      const postDepositBalanceFuel = await fuelWallet.getBalance(ASSET_ID);

      expect(
        postDepositBalanceFuel
          .sub(preDepositBalanceFuel)
          .format({ precision: 6, units: 9 })
      ).toBe(depositAmount);

      // check if it's settled on the list
      const statusLocator = depositLocator.getByText(`Settled`);
      await statusLocator.innerText();
    });

    await test.step('Withdraw from Fuel to ETH', async () => {
      // Go to the bridge page
      bridgePage = page.locator('button').getByText('Bridge');
      await bridgePage.click();

      // Go to the withdraw page
      const withdrawPage = getButtonByText(page, 'Withdraw from Fuel');
      await withdrawPage.click();

      const preWithdrawBalanceFuel = await fuelWallet.getBalance(ASSET_ID);
      const preWithdrawBalanceEth = await erc20Contract.read.balanceOf([
        account.address,
      ]);

      // Withdraw asset
      const withdrawAmount = '0.012345';
      const withdrawInput = page.locator('input');
      await withdrawInput.fill(withdrawAmount);
      const withdrawButton = getByAriaLabel(page, 'Withdraw');
      await withdrawButton.click();
      await page.waitForTimeout(2500);
      await walletApprove(context);

      await page.locator(':text("Action Required")').waitFor();

      // Check the popup is correct
      const transactionID = (
        await getByAriaLabel(page, 'Transaction ID').innerText()
      ).trim();
      const assetAmountWithdraw = getByAriaLabel(page, 'Asset amount');
      expect((await assetAmountWithdraw.innerHTML()).trim()).toBe(
        withdrawAmount
      );
      await closeTransactionPopup(page);

      // Go to transaction page
      const transactionList = page.locator('button').getByText('History');
      await transactionList.click();

      // Wait for transactions to get fetched and sorted
      await page.waitForTimeout(2000);

      // Check the transaction is there
      const withdrawLocator = getByAriaLabel(
        page,
        `Transaction ID: ${transactionID}`
      );

      const actionRequiredLocator =
        withdrawLocator.getByText('Action Required');
      await actionRequiredLocator.innerText();
      const assetAmountLocator = withdrawLocator.getByText(
        `${withdrawAmount} TKN`
      );
      await assetAmountLocator.innerText();

      await assetAmountLocator.click();
      // await page.waitForTimeout(10000);
      const confirmButton = getButtonByText(page, 'Confirm Transaction');
      await confirmButton.click();

      // For some reason we need this even if we wait for load state on the metamask notification page
      await page.waitForTimeout(3000);

      let metamaskNotificationPage = context
        .pages()
        .find((p) => p.url().includes('notification'));
      if (!metamaskNotificationPage) {
        metamaskNotificationPage = await context.waitForEvent('page', {
          predicate: (page) => page.url().includes('notification'),
        });
      }
      const proceedAnyways = metamaskNotificationPage.getByText(
        'I want to proceed anyway'
      );
      const count = await proceedAnyways.count();
      if (count) {
        await proceedAnyways.click();
      }

      // Timeout needed until https://github.com/Synthetixio/synpress/issues/795 is fixed
      await page.waitForTimeout(5000);
      await metamask.confirmTransaction();

      await closeTransactionPopup(page);

      const postWithdrawBalanceEth = await erc20Contract.read.balanceOf([
        account.address,
      ]);
      const postWithdrawBalanceFuel = await fuelWallet.getBalance(ASSET_ID);

      expect(
        parseFloat(
          bn(postWithdrawBalanceEth.toString())
            .sub(bn(preWithdrawBalanceEth.toString()))
            .format({ precision: 6, units: 18 })
        )
      ).toBeCloseTo(parseFloat(withdrawAmount));

      expect(
        preWithdrawBalanceFuel
          .sub(postWithdrawBalanceFuel)
          .format({ precision: 6, units: 9 })
      ).toBe(withdrawAmount);
    });
  });
});
