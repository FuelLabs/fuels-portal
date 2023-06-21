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

const pathToExtension = path.join(__dirname, './dist-crx');

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    // required for synpress
    global.expect = expect;

    const extensionUrl = 'https://wallet.fuel.network/app/fuel-wallet.zip';

    const zipFile = './packages/app/playwright/e2e/fuel-wallet.zip';
    const zipFileStream = fs.createWriteStream(zipFile);
    // TODO fetch the exact version of wallet to avoid breaking ci
    const zipPromise = new Promise((resolve, reject) => {
      https
        .get(extensionUrl, (res) => {
          res.pipe(zipFileStream);
          // after download completed close filestream
          zipFileStream.on('finish', async () => {
            zipFileStream.close();
            console.log('Download Completed extracting zip...');
            const zip = new admZip(zipFile); // eslint-disable-line new-cap
            zip.extractAllTo('./packages/app/playwright/e2e/dist-crx', true);
            console.log('zip extracted');
            resolve(true);
          });
        })
        .on('error', (error) => {
          console.log('error: ', error);
          reject(error);
        });
    });
    await zipPromise;

    // download metamask
    const metamaskPath = await prepareMetamask(
      process.env.META_MASK_VERSION || '10.25.0'
    );
    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath},${pathToExtension}`,
      `--load-extension=${metamaskPath},${pathToExtension}`,
      '--remote-debugging-port=9222',
    ];
    if (process.env.CI) {
      browserArgs.push('--disable-gpu');
    }
    if (process.env.HEADLESS_MODE) {
      browserArgs.push('--headless=new');
    }
    // launch browser
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: browserArgs,
    });
    // wait for metamask
    await context.pages()[0].waitForTimeout(3000);
    // setup metamask
    await initialSetup(chromium, {
      secretWordsOrPrivateKey:
        'test test test test test test test test test test test junk',
      rpcUrl: 'http://localhost:8080',
      network: 'localhost',
      password: 'Tester@1234',
      enableAdvancedSettings: true,
    });
    await context.pages()[0].waitForTimeout(3000);
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
