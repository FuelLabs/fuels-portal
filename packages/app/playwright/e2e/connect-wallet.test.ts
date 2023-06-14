import * as metamask from '@synthetixio/synpress/commands/metamask';

import { test, expect } from './fixtures';

test.beforeEach(async ({ page }) => {
  // baseUrl is set in playwright.config.ts
  await page.goto('/');
});

test('connect wallet using default metamask account', async ({ page }) => {
  expect(true).toBeTruthy();
});

// test('import private key and connect wallet using imported metamask account', async ({
//   page,
// }) => {
//   await metamask.importAccount(
//     '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97'
//   );
//   await page.click('#connectButton');
//   await metamask.acceptAccess();
//   await expect(page.locator('#accounts')).toHaveText(
//     '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f'
//   );
// });
