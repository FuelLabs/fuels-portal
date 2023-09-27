import type { Page } from '@playwright/test';

import { getByAriaLabel } from '../../commons';

export async function closeTransactionPopup(page: Page) {
  const popupTransactino = getByAriaLabel(page, 'Close Transaction Dialog');
  await popupTransactino.click();
}
