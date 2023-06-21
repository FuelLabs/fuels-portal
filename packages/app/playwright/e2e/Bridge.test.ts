import type { BrowserContext, Page } from '@playwright/test';
import * as metamask from '@synthetixio/synpress/commands/metamask';

import { getByAriaLabel, getButtonByText } from '../commons';

import { test } from './fixtures';

const MNEMONIC =
  'demand fashion unaware upgrade upon heart bright august panel kangaroo want gaze';
const WALLET_PASSWORD = '$123Ran123Dom123!';

async function walletSetup(
  context: BrowserContext,
  fuelExtensionId: string,
  page: Page
) {
  // const appPage = await context.newPage();
  // await appPage.goto('/');

  // const hasFuel = await appPage.evaluate(() => {
  //   return typeof window.fuel === 'object';
  // });
  // expect(hasFuel).toBeTruthy();

  // Wallet Setup
  // const walletPage = await context.newPage();
  await page.goto(`chrome-extension://${fuelExtensionId}/popup.html`);

  const signupPage = await context.waitForEvent('page', {
    predicate: (page) => page.url().includes('sign-up'),
  });
  expect(signupPage.url()).toContain('sign-up');

  const button = signupPage.locator('h3').getByText('Import seed phrase');
  await button.click();

  // Agree to T&S
  await signupPage.getByRole('checkbox').click();
  const toSeedPhrase = getButtonByText(signupPage, 'Next: Seed Phrase');
  await toSeedPhrase.click();

  // Copy and paste seed phrase
  /** Copy words to clipboard area */
  await signupPage.evaluate(`navigator.clipboard.writeText('${MNEMONIC}')`);
  const pasteButton = signupPage.locator('button').getByText('Paste');
  await pasteButton.click();
  const toPassword = signupPage
    .locator('button')
    .getByText('Next: Your password');
  await toPassword.click();

  // Enter password
  const enterPassword = signupPage.locator(`[aria-label="Your Password"]`);
  await enterPassword.type(WALLET_PASSWORD);
  // Confirm password
  const confirmPassword = signupPage.locator(`[aria-label="Confirm Password"]`);
  await confirmPassword.type(WALLET_PASSWORD);
  const toFinish = getButtonByText(signupPage, 'Next: Finish set-up');
  await toFinish.click();
}

async function walletConnect(context: BrowserContext) {
  let approvePage = context.pages().find((p) => p.url().includes('/popup'));
  if (!approvePage) {
    approvePage = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('/popup'),
    });
  }

  const nextButton = approvePage.locator('button').getByText('Next');
  await nextButton.click();
  const connectButton = approvePage.locator('button').getByText('Connect');
  await connectButton.click();
}

async function walletApprove(context: BrowserContext) {
  let approvePage = context.pages().find((p) => p.url().includes('/popup'));
  if (!approvePage) {
    approvePage = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('/popup'),
    });
  }

  const approveButton = approvePage.locator('button').getByText('Approve');
  await approveButton.click();
}

test.describe('Bridge', () => {
  test.beforeAll(async ({ context, extensionId, page }) => {
    await walletSetup(context, extensionId, page);
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
    await metamask.acceptAccess({ timeout: 30000 });

    // Connect fuel
    const connectFuel = getByAriaLabel(page, 'To Connect wallet');
    await connectFuel.click();
    await walletConnect(context);

    // Deposit asset
    const depositAmount = '1.000';
    const depositInput = page.locator('input');
    await depositInput.fill(depositAmount);
    // TODO check balance is correct and gets updated
    const depositButton = getButtonByText(page, 'Bridge asset');
    await depositButton.click();
    await metamask.confirmTransaction();

    // check the popup is correct
    const assetAmount = getByAriaLabel(page, 'Asset amount');
    await page.waitForTimeout(5000);
    expect((await assetAmount.innerHTML()).trim()).toBe(depositAmount);
    const closeEthPopup = getByAriaLabel(page, 'Close unlock window');
    await closeEthPopup.click();

    // Go to transaction page
    const transactionList = page.locator('a').getByText('Transactions');
    await transactionList.click();

    // check the transaction is there
    const transactionAssetAmount = getByAriaLabel(page, 'Asset amount');
    expect((await transactionAssetAmount.last().innerHTML()).trim()).toBe(
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

    // Withdraw asset
    const withdrawAmount = '0.010';
    const withdrawInput = page.locator('input');
    await withdrawInput.fill(withdrawAmount);
    // TODO check balance is correct and gets updated
    const withdrawButton = getButtonByText(page, 'Bridge asset');
    await withdrawButton.click();
    await walletApprove(context);

    // Check the popup is correct
    const assetAmountWithdraw = getByAriaLabel(page, 'Asset amount');
    await page.waitForTimeout(9000);
    expect((await assetAmountWithdraw.innerHTML()).trim()).toBe(withdrawAmount);
    const closeEthPopupWithdraw = getByAriaLabel(page, 'Close unlock window');
    await closeEthPopupWithdraw.click();

    // Go to the transaction page
    await transactionList.click();

    // Check the transaction is there
    expect((await transactionAssetAmount.last().innerHTML()).trim()).toBe(
      withdrawAmount
    );
    // Confirm the transaction
  });
});
