import { defineConfig, devices } from '@playwright/test';

const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: skipWebServer
    ? undefined
    : {
        command: 'npm run pages-preview -- --port 4173',
        url: 'http://127.0.0.1:4173/witness-attestation/',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  use: {
    baseURL: 'http://127.0.0.1:4173/witness-attestation/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
