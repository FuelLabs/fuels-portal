import type { Page } from '@playwright/test';
import test, { expect } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText } from '../commons';

const hasDropdownSymbol = async (page: Page, symbol: string) => {
  const assetDropdown = getByAriaLabel(page, 'Coin Selector').getByText(symbol);
  expect(await assetDropdown.innerText()).toBe(symbol);
};

test.describe('Token List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bridge');
  });

  test('e2e token list', async ({ page }) => {
    await test.step('Check if ETH is in the dropdown', async () => {
      await hasDropdownSymbol(page, 'ETH');
    });

    await test.step('Check if we can switch asset on deposit page', async () => {
      const assetDropdown = getByAriaLabel(page, 'Coin Selector');
      await assetDropdown.click();

      await hasText(page, 'Select token');
      // Check that assets are displayed
      const ethAsset = page.getByRole('button', { name: 'AssetLogo ETH' });
      expect(await ethAsset.innerText()).toBe('ETH');
      const tknAsset = page.getByRole('button', { name: 'TKN' });
      expect(await tknAsset.innerText()).toBe('TKN');
      await tknAsset.click();

      await hasDropdownSymbol(page, 'TKN');
    });

    await test.step('Check if we can switch asset on withdraw page', async () => {
      await hasDropdownSymbol(page, 'TKN');

      // Go to withdraw page
      const withdrawPageButton = getButtonByText(page, 'Withdraw from Fuel');
      await withdrawPageButton.click();

      const assetDropdown = getByAriaLabel(page, 'Coin Selector');
      await assetDropdown.click();

      await hasText(page, 'Select token');
      // Check that assets are displayed
      const ethAsset = page.getByRole('button', { name: 'AssetLogo ETH' });
      expect(await ethAsset.innerText()).toBe('ETH');
      const tknAsset = page.getByRole('button', { name: 'TKN' });
      expect(await tknAsset.innerText()).toBe('TKN');
      await ethAsset.click();

      await hasDropdownSymbol(page, 'ETH');
    });
  });
});
