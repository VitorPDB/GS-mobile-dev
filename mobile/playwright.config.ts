import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./e2e',workers:1,timeout:90000,
  use:{baseURL:'http://localhost:8081',viewport:{width:1440,height:1100},launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}},
  reporter:'list',
  webServer:{command:'npm run preview',url:'http://localhost:8081',reuseExistingServer:!process.env.CI,timeout:15000},
});
