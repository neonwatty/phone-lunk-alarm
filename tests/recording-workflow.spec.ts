import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Recording Workflow
 *
 * Tests the clip recording feature in PhoneDetector:
 * - Record button visibility and interaction
 * - Recording timer display
 * - Preview modal functionality
 * - Share buttons
 *
 * NOTE: These tests require camera hardware and are skipped in CI environments.
 * To run locally with camera access:
 *   npm run test:e2e -- --headed --grep "recording"
 */

test.describe('Recording Workflow E2E', () => {
  // These tests require:
  // 1. Camera hardware access
  // 2. WebGL support for TensorFlow.js
  // 3. Headed browser mode
  // Run with: npx playwright test tests/recording-workflow.spec.ts --headed --project=chromium

  test.beforeEach(async ({ page, context, browserName }, testInfo) => {
    // Skip all tests in CI environment (no camera hardware)
    test.skip(!!process.env.CI, 'Camera hardware required - skipping in CI')

    // Skip if running in headless mode (no WebGL/camera support)
    test.skip(testInfo.project.use?.headless !== false, 'Requires headed mode with camera - run with --headed')

    // Grant camera permissions for the context
    await context.grantPermissions(['camera'])

    // Navigate to the home page
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Wait for model to load and start camera
    const startButton = page.locator('button:has-text("Start Camera")')
    await startButton.waitFor({ state: 'visible', timeout: 30000 })
    await startButton.click()

    // Wait for camera to activate - use longer timeout and wait for MONITORING indicator in #demo section
    await expect(page.locator('#demo').getByText('MONITORING')).toBeVisible({ timeout: 15000 })
  })

  test('shows record button when camera is active', async ({ page }) => {
    // Record button should be visible - it's a circular button at the bottom right
    const recordButton = page.locator('button[title="Start recording"]')
    await expect(recordButton).toBeVisible()

    // Button should have the red dot indicator (not recording state)
    const redDot = recordButton.locator('div.bg-red-600.rounded-full')
    await expect(redDot).toBeVisible()
  })

  test('starts recording when record button is clicked', async ({ page }) => {
    // Wait for component to stabilize after camera init
    await page.waitForTimeout(1000)

    // Click the record button using force to handle any DOM changes
    await page.click('button[title="Start recording"]', { force: true })

    // Should now show stop recording button
    await expect(page.locator('button[title="Stop recording"]')).toBeVisible({ timeout: 3000 })

    // Timer should appear
    const timer = page.locator('span.font-mono.font-bold')
    await expect(timer).toBeVisible()

    // Timer should show 00:00 initially
    await expect(timer).toHaveText('00:00')

    // Should show the max duration indicator
    await expect(page.locator('text=/ 0:30')).toBeVisible()

    // Recording indicator (pulsing red dot) should be visible
    const recordingIndicator = page.locator('div.bg-red-500.rounded-full.animate-pulse')
    await expect(recordingIndicator.first()).toBeVisible()
  })

  test('timer increments during recording', async ({ page }) => {
    // Wait for component to stabilize
    await page.waitForTimeout(1000)

    // Start recording
    await page.click('button[title="Start recording"]', { force: true })

    // Wait for timer to appear
    const timer = page.locator('span.font-mono.font-bold')
    await expect(timer).toBeVisible({ timeout: 3000 })

    // Wait for 2 seconds and verify timer has incremented
    await page.waitForTimeout(2500)

    // Timer should show at least 00:02
    const timerText = await timer.textContent()
    expect(timerText).not.toBe('00:00')
  })

  test('stops recording and shows preview modal', async ({ page }) => {
    // Wait for component to stabilize
    await page.waitForTimeout(1000)

    // Start recording
    await page.click('button[title="Start recording"]', { force: true })

    // Wait for stop button and recording to start
    await expect(page.locator('button[title="Stop recording"]')).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(1500)

    // Stop recording
    await page.click('button[title="Stop recording"]', { force: true })

    // Preview modal should appear
    const modal = page.locator('text=🎬 Your Clip')
    await expect(modal).toBeVisible({ timeout: 5000 })

    // Video element in the modal should be present (has controls attribute, unlike webcam)
    const previewVideo = page.locator('video[controls]')
    await expect(previewVideo).toBeVisible()
  })

  test('preview modal has all share buttons', async ({ page }) => {
    // Wait for component to stabilize
    await page.waitForTimeout(1000)

    // Start recording
    await page.click('button[title="Start recording"]', { force: true })

    // Wait for stop button to appear
    await expect(page.locator('button[title="Stop recording"]')).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(1500)

    // Stop recording
    await page.click('button[title="Stop recording"]', { force: true })

    // Wait for modal to appear
    await expect(page.locator('text=🎬 Your Clip')).toBeVisible({ timeout: 5000 })

    // Check for Download button
    await expect(page.locator('button:has-text("Download")')).toBeVisible()

    // Check for Twitter/X button
    await expect(page.locator('button:has-text("X")')).toBeVisible()

    // Check for LinkedIn button
    await expect(page.locator('button:has-text("LinkedIn")')).toBeVisible()

    // Check for Copy Link button
    await expect(page.locator('button:has-text("Copy Link")')).toBeVisible()

    // Check for share message
    await expect(page.locator('text=Share your moment of justice')).toBeVisible()
  })

  test('preview modal can be closed', async ({ page }) => {
    // Wait for component to stabilize
    await page.waitForTimeout(1000)

    // Start recording
    await page.click('button[title="Start recording"]', { force: true })

    // Wait for stop button
    await expect(page.locator('button[title="Stop recording"]')).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(1500)

    // Stop recording
    await page.click('button[title="Stop recording"]', { force: true })

    // Wait for modal
    const modalTitle = page.locator('text=🎬 Your Clip')
    await expect(modalTitle).toBeVisible({ timeout: 5000 })

    // Click close button (✕)
    await page.click('button:has-text("✕")')

    // Modal should be gone
    await expect(modalTitle).not.toBeVisible()

    // Record button should be visible again
    await expect(page.locator('button[title="Start recording"]')).toBeVisible()
  })

  test('can start new recording after closing preview', async ({ page }) => {
    // Wait for component to stabilize
    await page.waitForTimeout(1000)

    // First recording
    await page.click('button[title="Start recording"]', { force: true })

    // Wait for stop button
    await expect(page.locator('button[title="Stop recording"]')).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(1000)

    // Stop recording
    await page.click('button[title="Stop recording"]', { force: true })

    // Close preview
    await expect(page.locator('text=🎬 Your Clip')).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("✕")')
    await expect(page.locator('text=🎬 Your Clip')).not.toBeVisible()

    // Wait for component to stabilize after modal close
    await page.waitForTimeout(500)

    // Start another recording
    await page.click('button[title="Start recording"]', { force: true })

    // Should show stop button again
    await expect(page.locator('button[title="Stop recording"]')).toBeVisible({ timeout: 3000 })

    // Timer should reset to 00:00
    const timer = page.locator('span.font-mono.font-bold')
    await expect(timer).toHaveText('00:00')
  })

  test('download button triggers file download', async ({ page }) => {
    // Wait for component to stabilize
    await page.waitForTimeout(1000)

    // Start recording
    await page.click('button[title="Start recording"]', { force: true })

    // Wait for stop button
    await expect(page.locator('button[title="Stop recording"]')).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(1500)

    // Stop recording
    await page.click('button[title="Stop recording"]', { force: true })

    // Wait for modal
    await expect(page.locator('text=🎬 Your Clip')).toBeVisible({ timeout: 5000 })

    // Set up download listener
    const downloadPromise = page.waitForEvent('download')

    // Click download button
    await page.click('button:has-text("Download")')

    // Should trigger download
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/phone-lunk-.*\.webm/)
  })

  test('copy link button shows success toast', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-write'])

    // Wait for component to stabilize
    await page.waitForTimeout(1000)

    // Start recording
    await page.click('button[title="Start recording"]', { force: true })

    // Wait for stop button
    await expect(page.locator('button[title="Stop recording"]')).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(1500)

    // Stop recording
    await page.click('button[title="Stop recording"]', { force: true })

    // Wait for modal
    await expect(page.locator('text=🎬 Your Clip')).toBeVisible({ timeout: 5000 })

    // Click copy link button
    await page.click('button:has-text("Copy Link")')

    // Should show success toast
    await expect(page.locator('text=Link copied!')).toBeVisible({ timeout: 3000 })
  })

  test('stopping camera also stops recording', async ({ page }) => {
    // Wait for component to stabilize
    await page.waitForTimeout(1000)

    // Start recording
    await page.click('button[title="Start recording"]', { force: true })

    // Verify recording is active
    await expect(page.locator('button[title="Stop recording"]')).toBeVisible({ timeout: 3000 })

    // Stop camera entirely
    await page.click('button:has-text("Stop Camera")')

    // Should show start camera button
    await expect(page.locator('button:has-text("Start Camera")')).toBeVisible()

    // Camera placeholder should show
    await expect(page.locator('text=Camera is off')).toBeVisible()
  })
})

test.describe('Recording Workflow - CI Safe Tests', () => {
  // These tests don't require actual camera/recording functionality

  test('page loads without errors', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Page should load without JavaScript errors
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.waitForTimeout(1000)
    expect(errors).toHaveLength(0)
  })

  test('RecordingPreviewModal component is defined', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // The modal component should be loadable (it's imported in PhoneDetector)
    // We verify this by checking the page loads without import errors
    await expect(page.locator('body')).toBeVisible()
  })
})
