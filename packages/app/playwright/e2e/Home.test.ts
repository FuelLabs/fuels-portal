import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { hasText, visit } from '../commons';

test.describe('Home', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test('Should render Hi', async () => {
    await visit(page, '/');
    await hasText(page, /Hi/i);
  });
});
