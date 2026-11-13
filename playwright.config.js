import { defineConfig, devices } from "@playwright/test";

const PORT = 8655;
const LIVE = process.env.BASE_URL;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: LIVE || `http://localhost:${PORT}`, acceptDownloads: true, timezoneId: "Europe/London", locale: "en-GB" },
  webServer: LIVE ? undefined : { command: `node tools/serve.js ${PORT}`, port: PORT, reuseExistingServer: true },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } }
  ]
});
