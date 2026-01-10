/**
 * ============================================================================
 * PLAYWRIGHT CONFIGURATION
 * ============================================================================
 *
 * Main configuration file for Playwright tests.
 *
 * Key configurations:
 * - Timeouts (test, expect, navigation)
 * - Parallel execution settings
 * - CI/CD settings (retries, workers)
 * - Reporters (HTML, JSON, JUnit for CI)
 * - Browser projects (Chrome, Firefox, Safari, API)
 * - Global setup for loading environment variables
 *
 * Docs: https://playwright.dev/docs/test-configuration
 * ============================================================================
 */

import { devices, PlaywrightTestConfig } from "@playwright/test";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({
  path: "./env.ts",
  quiet: true,
});

const config: PlaywrightTestConfig = {
  // ===========================================================================
  // TIMEOUTS
  // ===========================================================================

  /** Maximum time one test can run for (40 seconds) */
  timeout: 40 * 1000,

  expect: {
    /** Maximum time for expect() assertions (7 seconds) */
    timeout: 7 * 1000,
  },

  // ===========================================================================
  // EXECUTION SETTINGS
  // ===========================================================================

  /** Run tests in files in parallel */
  fullyParallel: true,

  /** Fail build on CI if test.only is left in code */
  forbidOnly: !!process.env.CI,

  /** Retry failed tests (only on CI) */
  retries: process.env.CI ? 2 : 0,

  /** Number of parallel workers (limited on CI) */
  workers: process.env.CI ? 2 : undefined,

  // ===========================================================================
  // REPORTERS
  // ===========================================================================
  // Docs: https://playwright.dev/docs/test-reporters
  // ===========================================================================

  reporter: [
    // HTML report (for local development)
    ["html", { open: "never" }],
    // List reporter (console output)
    ["list"],
    // JSON report (for programmatic access)
    ["json", { outputFile: "test-output.json" }],
    // JUnit report (for CI/CD systems)
    [
      "junit",
      {
        outputFile: "results/test-results.xml",
        embedAnnotationsAsProperties: true,
      },
    ],
  ],

  // ===========================================================================
  // SHARED TEST OPTIONS
  // ===========================================================================
  // These settings apply to all projects unless overridden
  // Docs: https://playwright.dev/docs/api/class-testoptions
  // ===========================================================================

  use: {
    /** Use data-testid attribute for locators */
    testIdAttribute: "data-testid",

    /** Collect trace on failure (useful for debugging) */
    trace: "retain-on-failure",

    /** Take screenshot on failure */
    screenshot: "only-on-failure",

    /** Don't record video by default (saves resources) */
    video: "off",

    /** Ignore HTTPS errors */
    contextOptions: {
      ignoreHTTPSErrors: true,
    },
  },

  // ===========================================================================
  // GLOBAL SETUP
  // ===========================================================================

  /** Run global-setup.ts before all tests (loads .env files) */
  globalSetup: "./global-setup.ts",

  // ===========================================================================
  // PROJECTS (BROWSER CONFIGURATIONS)
  // ===========================================================================
  // Each project runs tests in a specific browser/configuration
  // Docs: https://playwright.dev/docs/test-projects
  // ===========================================================================

  projects: [
    // =========================================================================
    // CHROME (Primary browser for UI tests)
    // =========================================================================
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        // Grant permissions for clipboard, geolocation
        permissions: ["clipboard-read", "clipboard-write", "geolocation"],
        deviceScaleFactor: undefined,
        viewport: { width: 1420, height: 720 },
        launchOptions: {
          args: [
            "--start-maximized",
            // Fake media stream for camera/microphone tests
            "--use-fake-device-for-media-stream",
            "--use-fake-ui-for-media-stream",
            "--mute-audio",
            "--autoplay-policy=no-user-gesture-required",
          ],
        },
        channel: "chrome",
      },
      testDir: "./tests/ui-tests",
    },

    // =========================================================================
    // FIREFOX
    // =========================================================================
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          args: [
            "--use-fake-device-for-media-stream",
            "--use-fake-ui-for-media-stream",
            "--mute-audio",
          ],
        },
        viewport: { width: 1420, height: 720 },
      },
      testDir: "./tests/ui-tests",
    },

    // =========================================================================
    // SAFARI
    // =========================================================================
    {
      name: "safari",
      use: {
        ...devices["Desktop Safari"],
      },
      testDir: "./tests/ui-tests",
    },

    // =========================================================================
    // API TESTS (No browser needed)
    // =========================================================================
    {
      name: "api-tests",
      testDir: "./tests/api-tests",
      // No browser configuration needed for pure API tests
    },

    // =========================================================================
    // E2E TESTS (Uses Chrome by default)
    // =========================================================================
    {
      name: "e2e-tests",
      use: {
        ...devices["Desktop Chrome"],
        permissions: ["clipboard-read", "clipboard-write", "geolocation"],
        viewport: { width: 1420, height: 720 },
        launchOptions: {
          args: [
            "--start-maximized",
            "--use-fake-device-for-media-stream",
            "--use-fake-ui-for-media-stream",
            "--mute-audio",
          ],
        },
        channel: "chrome",
      },
      testDir: "./tests/e2e-tests",
    },

    // =========================================================================
    // MOBILE (Optional - uncomment to enable)
    // =========================================================================
    // {
    //   name: "mobile-chrome",
    //   use: { ...devices["Pixel 5"] },
    //   testDir: "./tests/ui-tests",
    // },
    // {
    //   name: "mobile-safari",
    //   use: { ...devices["iPhone 12"] },
    //   testDir: "./tests/ui-tests",
    // },
  ],

  // ===========================================================================
  // LOCAL DEV SERVER (Optional)
  // ===========================================================================
  // Uncomment if you want to start your app before tests
  // ===========================================================================
  // webServer: {
  //   command: "npm run start",
  //   url: "http://127.0.0.1:3000",
  //   reuseExistingServer: !process.env.CI,
  // },
};

export default config;
