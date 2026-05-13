import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: process.env.TODO_WEB_URL ?? 'http://127.0.0.1:4200',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'dotnet run --project ../TodoApi --launch-profile http',
      url: `${process.env.TODO_API_URL ?? 'http://127.0.0.1:5040'}/api/todos`,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm start -- --host 127.0.0.1',
      url: process.env.TODO_WEB_URL ?? 'http://127.0.0.1:4200',
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
