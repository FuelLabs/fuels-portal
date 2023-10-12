import test, { expect } from '@playwright/test';

import { getByAriaLabel, hasText } from '../commons';

test.describe('Token List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bridge');
  });

  test('e2e token list', async ({ page }) => {
    await test.step('Check if ETH is in the dropdown', async () => {
      const assetDropdown = getByAriaLabel(page, 'Coin Selector').getByText(
        'ETH'
      );
      expect(await assetDropdown.innerText()).toBe('ETH');
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
    });
  });
});
