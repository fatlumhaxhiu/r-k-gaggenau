import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests', workers:1, timeout:90000,
 testIgnore:'consent-leads.spec.ts',
 use:{baseURL:process.env.RK_TRACKING_TEST==='1'?'http://127.0.0.1:3117':'http://127.0.0.1:3107', trace:'retain-on-failure', screenshot:'only-on-failure'},
 outputDir:'.local-tests/results',
 reporter:[['list'],['json',{outputFile:'.local-tests/matrix.json'}],['html',{outputFolder:'.local-tests/report',open:'never'}]],
});
