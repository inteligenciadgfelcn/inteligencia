import type { PlaywrightTestConfig, ScreenshotMode } from '@playwright/test'
import { devices } from '@playwright/test'

import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.resolve(__dirname, 'test/e2e/playwright/config', '.env'),
})

const config: PlaywrightTestConfig = {
  testDir: process.env.PATH_TEST,
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? Number(process.env.WORKERS) : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['playwright-json-summary-reporter', {
      outputFile: 'playwright-report/summary.json',
      includeFailures: true,
      includeSteps: true
    }]
  ],
  use: {
    baseURL: process.env.BASE_URL,
    actionTimeout: 0,
    trace: 'on-first-retry',
    launchOptions: {
      headless: process.env.HEADLESS == 'true',
      slowMo: Number(process.env.SLOWMO ?? '0'),
    },
    screenshot: process.env.SCREENSHOTS_MODE
      ? (process.env.SCREENSHOTS_MODE as ScreenshotMode)
      : 'only-on-failure',
    video: process.env.VIDEO == 'on' ? 'on' : 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
      },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
}

export default config
