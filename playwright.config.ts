import { defineConfig, devices } from '@playwright/test'
import * as path from 'path'

const TEST_VIDEO_PATH = path.join(__dirname, 'tests', 'fixtures', 'test-video.y4m')

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      // Special project for fake camera tests (watermark, recording)
      name: 'chromium-fake-camera',
      testMatch: /watermark\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
            `--use-file-for-fake-video-capture=${TEST_VIDEO_PATH}`,
            // Required for WebGL/canvas in headless mode
            '--enable-webgl',
            '--use-gl=swiftshader',
            '--disable-gpu-sandbox',
            '--enable-unsafe-swiftshader',
          ],
        },
        permissions: ['camera'],
        // Longer timeout for recording operations
        actionTimeout: 15000,
        navigationTimeout: 30000,
      },
    },
  ],

  webServer: {
    command: 'npx next dev -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Give Next.js more time to start
  },
})
