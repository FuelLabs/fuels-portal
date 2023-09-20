/* eslint-disable no-console */
/* eslint-disable no-empty-pattern */
// Use a test fixture to set the context so tests have access to the wallet extension.
import type { BrowserContext } from '@playwright/test';
import { chromium, test as base } from '@playwright/test';
import { initialSetup } from '@synthetixio/synpress/commands/metamask';
import { prepareMetamask } from '@synthetixio/synpress/helpers';
import admZip from 'adm-zip';
import * as fs from 'fs';
import https from 'https';
import path from 'path';
import { setTimeout } from 'timers/promises';

import { ETH_MNEMONIC, ETH_WALLET_PASSWORD } from '../mocks';

const fuelPathExtension = path.join(__dirname, './dist-crx');

const extensionsData = {};

async function getExtensionsData(context: BrowserContext) {
  const page = await context.newPage();

  await page.goto('chrome://extensions');
  await page.waitForLoadState('load');
  await page.waitForLoadState('domcontentloaded');

  const devModeButton = page.locator('#devMode');
  await devModeButton.waitFor();
  await devModeButton.focus();
  await devModeButton.click();

  const extensionDataItems = await page.locator('extensions-item').all();
  for (const extensionData of extensionDataItems) {
    const extensionName = (
      await extensionData
        .locator('#name-and-version')
        .locator('#name')
        .textContent()
    ).toLowerCase();

    const extensionVersion = (
      await extensionData
        .locator('#name-and-version')
        .locator('#version')
        .textContent()
    ).replace(/(\n| )/g, '');

    const extensionId = (
      await extensionData.locator('#extension-id').textContent()
    ).replace('ID: ', '');

    extensionsData[extensionName] = {
      version: extensionVersion,
      id: extensionId,
    };
  }
  await page.close();

  return extensionsData;
}

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    // required for synpress
    global.expect = expect;

    const extensionUrl =
      'https://github.com/FuelLabs/fuels-wallet/releases/download/v0.12.0/fuel-wallet-chrome-0.12.0.zip';

    const zipFile = './packages/app/playwright/e2e/fuel-wallet.zip';
    const zipFileStream = fs.createWriteStream(zipFile);

    function downloadFile(url, attempt = 1) {
      return new Promise((resolve, reject) => {
        https
          .get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
              if (attempt > 5) {
                // prevent infinite loops if there's a redirect loop
                reject(new Error('Too many redirects'));
                return;
              }

              const newUrl = res.headers.location;
              console.log(`Redirecting to: ${newUrl}`);
              downloadFile(newUrl, attempt + 1).then(resolve, reject);
              return;
            }

            if (res.statusCode !== 200) {
              reject(new Error(`Unexpected status code: ${res.statusCode}`));
              return;
            }

            res.pipe(zipFileStream);

            zipFileStream.on('finish', () => {
              zipFileStream.close(resolve);
            });

            zipFileStream.on('error', (error) => {
              reject(error);
            });
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    }

    await downloadFile(extensionUrl);

    console.log('Download Completed extracting zip...');
    const zip = new admZip(zipFile); // eslint-disable-line new-cap
    zip.extractAllTo('./packages/app/playwright/e2e/dist-crx', true);

    console.log('zip extracted');

    // download metamask
    const metamaskPath = await prepareMetamask(
      process.env.META_MASK_VERSION || '10.25.0'
    );

    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath},${fuelPathExtension}`,
      `--load-extension=${metamaskPath},${fuelPathExtension}`,
      '--remote-debugging-port=9222',
    ];

    // launch browser
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: browserArgs,
    });

    const extenssions = await getExtensionsData(context);
    console.log('extenssions', extenssions);
    async function waitForPages() {
      const pages = await context.pages();

      const hasMetamask = pages.find((page) => {
        return page.url().includes(extenssions['metamask'].id);
      });
      const hasFuelWallet = pages.find((page) => {
        return page.url().includes(extenssions['fuel wallet'].id);
      });

      console.log(
        'page urls',
        pages.map((p) => p.url())
      );
      console.log('Waiting for the pages');
      if (!hasMetamask || !hasFuelWallet) {
        console.log('Pages not found!');
        await setTimeout(3000);
        return waitForPages();
      }
      console.log('Pages found!');
      return true;
    }

    // Wait for Fuel Wallet to load
    await waitForPages();

    try {
      await initialSetup(chromium, {
        secretWordsOrPrivateKey: ETH_MNEMONIC,
        rpcUrl: 'http://localhost:8080',
        network: 'localhost',
        password: ETH_WALLET_PASSWORD,
        enableAdvancedSettings: true,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;
