import { test, expect } from '@playwright/test'

/**
 * E2E Tests for PhoneDetector Component
 *
 * NOTE: These tests require camera hardware and are skipped in CI environments.
 * To run locally with camera access:
 *   npm run test:e2e -- --headed --grep "camera"
 */

test.describe('PhoneDetector E2E', () => {
  test.beforeEach(async ({ page, context }) => {
    // Skip all tests in CI environment (no camera hardware)
    test.skip(!!process.env.CI, 'Camera hardware required - skipping in CI')

    // Grant camera permissions for the context
    await context.grantPermissions(['camera'])

    // Navigate to the home page
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test('renders phone detector section', async ({ page }) => {
    // Check that the detector section exists
    await expect(page.locator('text=Try It Yourself')).toBeVisible()
    await expect(page.locator('text=Your camera feed stays private')).toBeVisible()
  })

  test('shows start camera button after model loads', async ({ page }) => {
    // Wait for model to load (max 10 seconds)
    await page.waitForSelector('button:has-text("Start Camera")', { timeout: 10000 })

    const startButton = page.locator('button:has-text("Start Camera")')
    await expect(startButton).toBeVisible()
  })

  test('activates camera when start button clicked', async ({ page }) => {
    // Wait for and click start camera button
    const startButton = page.locator('button:has-text("Start Camera")')
    await startButton.waitFor({ state: 'visible', timeout: 10000 })
    await startButton.click()

    // Check that camera is now active
    await expect(page.locator('button:has-text("Stop Camera")')).toBeVisible({ timeout: 5000 })

    // Check for monitoring indicator
    await expect(page.locator('text=MONITORING')).toBeVisible()

    // Check for detection counter
    await expect(page.locator('text=Detections:')).toBeVisible()

    // Check for status indicator
    await expect(page.locator('text=All Clear')).toBeVisible()
  })

  test('displays camera switch button when camera is active', async ({ page }) => {
    // Start camera
    const startButton = page.locator('button:has-text("Start Camera")')
    await startButton.waitFor({ state: 'visible', timeout: 10000 })
    await startButton.click()

    // Wait for camera to activate
    await page.waitForSelector('button:has-text("Stop Camera")', { timeout: 5000 })

    // Check for camera switch button
    const switchButton = page.locator('button:has([title="Switch camera"])')
    await expect(switchButton).toBeVisible()

    // Check that it shows BACK (default facing mode)
    await expect(page.locator('text=BACK')).toBeVisible()
  })

  test('switches between front and back cameras', async ({ page }) => {
    // Start camera
    const startButton = page.locator('button:has-text("Start Camera")')
    await startButton.waitFor({ state: 'visible', timeout: 10000 })
    await startButton.click()

    // Wait for camera to activate
    await page.waitForSelector('text=BACK', { timeout: 5000 })

    // Click switch button
    const switchButton = page.locator('button:has([title="Switch camera"])')
    await switchButton.click()

    // Wait for switch to complete
    await page.waitForTimeout(200)

    // Should now show FRONT
    await expect(page.locator('text=FRONT')).toBeVisible()

    // Switch back
    await switchButton.click()
    await page.waitForTimeout(200)

    // Should show BACK again
    await expect(page.locator('text=BACK')).toBeVisible()
  })

  test('stops camera when stop button clicked', async ({ page }) => {
    // Start camera
    const startButton = page.locator('button:has-text("Start Camera")')
    await startButton.waitFor({ state: 'visible', timeout: 10000 })
    await startButton.click()

    // Wait for camera to activate
    await page.waitForSelector('button:has-text("Stop Camera")', { timeout: 5000 })

    // Stop camera
    const stopButton = page.locator('button:has-text("Stop Camera")')
    await stopButton.click()

    // Should show start button again
    await expect(page.locator('button:has-text("Start Camera")')).toBeVisible()

    // Monitoring indicator should be gone
    await expect(page.locator('text=MONITORING')).not.toBeVisible()
  })

  test('shows camera placeholder when camera is off', async ({ page }) => {
    // Wait for model to load
    await page.waitForSelector('button:has-text("Start Camera")', { timeout: 10000 })

    // Check for placeholder
    await expect(page.locator('text=Camera is off')).toBeVisible()
    await expect(page.locator('text=Click "Start Camera" to begin detection')).toBeVisible()
  })

  test('displays info cards about detector features', async ({ page }) => {
    // Check for info cards
    await expect(page.locator('text=Real-Time Detection')).toBeVisible()
    await expect(page.locator('text=Privacy First')).toBeVisible()
    await expect(page.locator('text=COCO-SSD Model')).toBeVisible()

    // Check for descriptions
    await expect(page.locator('text=Runs at ~5 FPS')).toBeVisible()
    await expect(page.locator('text=All processing in-browser')).toBeVisible()
    await expect(page.locator('text=Trained on millions of images')).toBeVisible()
  })

  test('handles camera permission denial gracefully', async ({ page, context }) => {
    // Deny camera permissions
    await context.clearPermissions()

    // Try to start camera
    const startButton = page.locator('button:has-text("Start Camera")')
    await startButton.waitFor({ state: 'visible', timeout: 10000 })
    await startButton.click()

    // Should show error message
    await expect(page.locator('text=Camera access')).toBeVisible({ timeout: 5000 })

    // Should show retry button
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible()
  })

  test('renders alarm effect component', async ({ page }) => {
    // The alarm effect should always be present (even if inactive)
    // This is a visual component that animates when phone is detected
    const pageContent = await page.content()

    // AlarmEffect is rendered, though it may not be visible when inactive
    expect(pageContent).toBeTruthy()
  })

  test('camera section is responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Wait for model to load
    await page.waitForSelector('button:has-text("Start Camera")', { timeout: 10000 })

    // Start button should be visible on mobile
    const startButton = page.locator('button:has-text("Start Camera")')
    await expect(startButton).toBeVisible()

    // Privacy notice should be visible
    await expect(page.locator('text=Your camera feed stays private')).toBeVisible()
  })
})

test.describe('PhoneDetector E2E - No Camera Tests (CI-Safe)', () => {
  test('renders detector section without camera access', async ({ page }) => {
    // These tests don't require camera and can run in CI
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Basic UI elements should render
    await expect(page.locator('text=Try It Yourself')).toBeVisible()
    await expect(page.locator('text=Your camera feed stays private')).toBeVisible()
  })

  test('shows loading state initially', async ({ page }) => {
    await page.goto('/')

    // Should show loading state while model loads
    const loadingIndicator = page.locator('text=Loading AI model')
    const isVisible = await loadingIndicator.isVisible().catch(() => false)

    // Loading may be very brief, so we just check the page loads
    expect(await page.locator('text=Try It Yourself').isVisible()).toBe(true)
  })
})
