import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { hasText, visit } from '../commons';

test.describe('Bridge', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test('Should render Fuel Native Bridge', async () => {
    await visit(page, '/bridge');
    await hasText(page, /Fuel Native Bridge/i);
  });
});
