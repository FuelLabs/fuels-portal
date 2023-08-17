import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText } from '../commons';

test.describe('Token List', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await page.goto('/');
  });

  test('should be able to add tokens', async () => {
    // Go to the bridge page
    const bridgePage = page.locator('a').getByText('Bridge');
    await bridgePage.click();

    const tokenListButton = getByAriaLabel(page, 'Coin Selector');
    await tokenListButton.click();

    const manageTokenListButton = getButtonByText(page, 'Manage token list');
    await manageTokenListButton.click();

    const addressInput = page.getByPlaceholder(
      'Search or paste custom address'
    );
    const tokenAddress = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52';
    await addressInput.fill(tokenAddress);

    await hasText(page, '0xB8c7...DD52');

    const addAssetButton = getByAriaLabel(page, 'AddEthAsset');
    await addAssetButton.click();

    await hasText(page, 'Add token 0xB8c7...DD52');

    const addTokenButton = getButtonByText(page, 'Add token to list');
    await expect(addTokenButton).toBeDisabled();

    const tokenSymbolInput = page.getByPlaceholder('SYMBOL');
    await tokenSymbolInput.fill('bnb');
    const tokenDecimalsInput = page.getByPlaceholder('18');
    await tokenDecimalsInput.fill('18');

    await addTokenButton.click();

    const bnbToken = page.getByText('BNB');
    await bnbToken.click();

    // Check that we switched assets on the bridge page
    await hasText(page, 'BNB');

    // TODO test remove token once AssetDialog component is fixed
  });
});
