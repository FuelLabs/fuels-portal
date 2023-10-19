import { expect, type Page } from '@playwright/test';

import { getButtonByText, getByAriaLabel } from '../../commons';

export async function closeTransactionPopup(page: Page) {
  const popupTransactino = getByAriaLabel(page, 'Close Transaction Dialog');
  await popupTransactino.click();
}

export const hasDropdownSymbol = async (page: Page, symbol: string) => {
  const assetDropdown = getByAriaLabel(page, 'Coin Selector').getByText(symbol);
  expect(await assetDropdown.innerText()).toBe(symbol);
};

export const goToBridgePage = async (page: Page) => {
  const bridgeButton = page.locator('button').getByText('Bridge');
  await bridgeButton.click();
};
export const goToTransactionsPage = async (page: Page) => {
  const transactionList = page.locator('button').getByText('History');
  await transactionList.click();
};

export const clickDepositTab = async (page: Page) => {
  const tab = getButtonByText(page, 'Deposit to Fuel');
  await tab.click();
};

export const clickWithdrawTab = async (page: Page) => {
  const tab = getButtonByText(page, 'Withdraw from Fuel');
  await tab.click();
};
