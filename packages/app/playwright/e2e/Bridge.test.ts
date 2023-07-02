import * as metamask from '@synthetixio/synpress/commands/metamask';
import type { WalletUnlocked } from 'fuels';
import { NativeAssetId, Wallet } from 'fuels';
import type { HDAccount, PublicClient } from 'viem';
import { createPublicClient, http } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';

import {
  getByAriaLabel,
  getButtonByText,
  walletSetup,
  walletApprove,
  walletConnect,
  FUEL_MNEMONIC,
} from '../commons';

import { test } from './fixtures';

test.describe('Bridge', () => {
  let client: PublicClient;
  let account: HDAccount;
  let fuelWallet: WalletUnlocked;

  test.beforeAll(async ({ context, extensionId, page }) => {
    await walletSetup(context, extensionId, page);
    client = createPublicClient({
      chain: foundry,
      transport: http(),
    });
    account = mnemonicToAccount(
      'test test test test test test test test test test test junk'
    );
    fuelWallet = Wallet.fromMnemonic(FUEL_MNEMONIC);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('e2e', async ({ context, page }) => {
    const hasFuel = await page.evaluate(() => {
      return typeof window.fuel === 'object';
    });
    expect(hasFuel).toBeTruthy();

    // Go to the bridge page
    const goToBridge = getByAriaLabel(page, 'Bridge');
    await goToBridge.click();

    // Connect metamask
    const connectKitButton = getByAriaLabel(page, 'From Connect wallet');
    await connectKitButton.click();
    const metamaskConnect = getButtonByText(page, 'Metamask');
    await metamaskConnect.click();
    await metamask.acceptAccess();

    // Connect fuel
    const connectFuel = getByAriaLabel(page, 'To Connect wallet');
    await connectFuel.click();
    await walletConnect(context);

    const preDepositBalanceFuel = await fuelWallet.getBalance(NativeAssetId);
    const prevDepositBalanceEth = await client.getBalance({
      address: account.address,
    });

    // Deposit asset
    const depositAmount = '1.000';
    const depositInput = page.locator('input');
    await depositInput.fill(depositAmount);
    const depositButton = getButtonByText(page, 'Bridge asset');
    await depositButton.click();
    await metamask.confirmTransaction();

    const postDepositBalanceEth = await client.getBalance({
      address: account.address,
    });

    expect(
      (
        (prevDepositBalanceEth - postDepositBalanceEth) /
        BigInt(1e18)
      ).toString()
    ).toBe('1');

    // check the popup is correct
    const assetAmount = getByAriaLabel(page, 'Asset amount');
    await page.waitForTimeout(5000);
    expect((await assetAmount.innerHTML()).trim()).toBe(depositAmount);
    const closeEthPopup = getByAriaLabel(page, 'Close unlock window');
    await closeEthPopup.click();

    const postDepositBalanceFuel = await fuelWallet.getBalance(NativeAssetId);

    expect(
      postDepositBalanceFuel
        .sub(preDepositBalanceFuel)
        .format({ precision: 3, units: 9 })
    ).toBe(depositAmount);

    // Go to transaction page
    const transactionList = page.locator('a').getByText('Transactions');
    await transactionList.click();

    // check the transaction is there
    let transactionAssetAmount = getByAriaLabel(page, 'Asset amount');
    expect((await transactionAssetAmount.first().innerHTML()).trim()).toBe(
      depositAmount
    );

    // Go to the bridge page
    const bridgePage = page
      .locator('div')
      .filter({ hasText: 'BridgeTransactions' })
      .getByRole('link', { name: 'Bridge ' });
    await bridgePage.first().click();

    // Go to the withdraw page
    const withdrawPage = getButtonByText(page, 'Withdraw from Fuel');
    await withdrawPage.click();

    const preWithdrawBalanceFuel = await fuelWallet.getBalance(NativeAssetId);
    const prevWithdrawBalanceEth = await client.getBalance({
      address: account.address,
    });

    // Withdraw asset
    const withdrawAmount = '0.010';
    const withdrawInput = page.locator('input');
    await withdrawInput.fill(withdrawAmount);
    const withdrawButton = getButtonByText(page, 'Bridge asset');
    await withdrawButton.click();
    await walletApprove(context);

    // Check the popup is correct
    const assetAmountWithdraw = getByAriaLabel(page, 'Asset amount');
    await page.waitForTimeout(11000);
    expect((await assetAmountWithdraw.innerHTML()).trim()).toBe(withdrawAmount);
    const closeEthPopupWithdraw = getByAriaLabel(page, 'Close unlock window');
    await closeEthPopupWithdraw.click();

    // Go to the transaction page
    await transactionList.click();

    transactionAssetAmount = getByAriaLabel(page, 'Asset amount');
    // Check the transaction is there
    expect((await transactionAssetAmount.first().innerHTML()).trim()).toBe(
      withdrawAmount
    );

    await transactionAssetAmount.first().click({ timeout: 10000 });
    const confirmButton = getButtonByText(page, 'Confirm Transaction');
    await confirmButton.click();
    await metamask.confirmTransaction();

    const postWithdrawBalanceEth = await client.getBalance({
      address: account.address,
    });
    const postWithdrawBalanceFuel = await fuelWallet.getBalance(NativeAssetId);

    // We only divide by 15 bc bigint does not support decimals
    expect(
      (postWithdrawBalanceEth - prevWithdrawBalanceEth) / BigInt(1e15)
    ).toBe(BigInt(9));

    expect(
      preWithdrawBalanceFuel
        .sub(postWithdrawBalanceFuel)
        .format({ precision: 3, units: 9 })
    ).toBe('0.010');
  });
});
