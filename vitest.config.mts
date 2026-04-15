/// <reference types="vitest" />

import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  publicDir: 'public',
  test: {
    globals: true,
    clearMocks: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['./*.node.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['./*.browser.test.ts'],
          browser: {
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            enabled: true,
            headless: true,
            screenshotFailures: false,
          },
        },
      },
    ],
  },
});
