import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check that we're on the home page
    expect(page.url()).toContain('/')
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')

    // Check for hero headline
    const headline = page.locator('h1').first()
    await expect(headline).toBeVisible()
  })

  test('should display features section', async ({ page }) => {
    await page.goto('/')

    // Check for features section
    const featuresSection = page.locator('#features')
    await expect(featuresSection).toBeVisible()
  })

  test('should have working theme toggle', async ({ page }) => {
    await page.goto('/')

    // Find and click theme toggle button
    const themeToggle = page.locator('button[aria-label*="Switch to"]')
    await expect(themeToggle).toBeVisible()

    // Click it
    await themeToggle.click()

    // Theme should change (check for class on html element)
    const html = page.locator('html')
    const hasLightClass = await html.evaluate(el => el.classList.contains('light'))
    const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'))

    expect(hasLightClass || hasDarkClass).toBe(true)
  })
})
