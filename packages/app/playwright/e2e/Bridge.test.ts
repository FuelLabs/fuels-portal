import type { Browser, Page } from '@playwright/test';
import { chromium } from '@playwright/test';
import * as metamask from '@synthetixio/synpress/commands/metamask';

import { getByAriaLabel, hasText, visit, getButtonByText } from '../commons';

import { test } from './fixtures';

test.describe('Bridge', () => {
  // let browser: Browser;
  // let page: Page;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // test.beforeAll(async () => {
  //   browser = await chromium.launch();
  //   page = await browser.newPage();
  // });

  test('e2e', async ({ page }) => {
    // Go to the bridge page
    const goToBridge = getByAriaLabel(page, 'Bridge');
    await goToBridge.click();

    // Connect metamask
    const connectKitButton = getByAriaLabel(page, 'From Connect wallet');
    await connectKitButton.click();
    const metamaskConnect = getButtonByText(page, 'Metamask');
    await metamaskConnect.click();
    await metamask.acceptAccess();
  });

  // test('Should render Fuel Native Bridge', async () => {
  //   await visit(page, '/bridge');
  //   await hasText(page, /Fuel Native Bridge/i);
  // });
});
