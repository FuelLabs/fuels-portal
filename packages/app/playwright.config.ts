import type { PlaywrightTestConfig } from '@playwright/test';
import { devices, defineConfig } from '@playwright/test';
import { join } from 'path';

const IS_CI = !!process.env.CI;
const PORT = process.env.PORT || 3004;

const config: PlaywrightTestConfig = defineConfig({
  workers: 1,
  testMatch: join(__dirname, './playwright/**/*.test.ts'),
  testDir: join(__dirname, './playwright/'),
  timeout: 60000 * 2,
  expect: {
    timeout: 5000,
  },
  reporter: 'html',
  // Retry tests on CI if they fail
  retries: IS_CI ? 2 : 0,
  webServer: {
    command: `pnpm dev`,
    port: Number(PORT),
    reuseExistingServer: true,
  },
  use: {
    baseURL: `http://localhost:${PORT}/`,
    permissions: ['clipboard-read', 'clipboard-write'],
    trace: 'on',
    headless: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

export default config;
