import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./e2e',workers:1,timeout:90000,
  use:{baseURL:'http://127.0.0.1:8091',viewport:{width:1440,height:1100},launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}},
  reporter:[['list'],['html',{open:'never'}]],
  webServer:{command:'node scripts/serve-web.mjs',url:'http://127.0.0.1:8091',env:{WEB_PORT:'8091'},reuseExistingServer:false,timeout:15000},
});
