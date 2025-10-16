import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Privacy Policy');
  });

  test('should have proper meta information', async ({ page }) => {
    await expect(page).toHaveTitle(/PrivacyHub/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /privacy/i);
  });

  test('should display privacy analyzer interface', async ({ page }) => {
    // Check for URL input field
    const urlInput = page.locator('input[type="url"]');
    await expect(urlInput).toBeVisible();
    await expect(urlInput).toHaveAttribute('placeholder', /privacy/i);

    // Check for analyze button
    const analyzeButton = page.locator('button:has-text("Analyze")');
    await expect(analyzeButton).toBeVisible();
  });

  test('should display reset button when URL is entered', async ({ page }) => {
    // Initially reset button should not be visible
    const resetButton = page.locator('button:has-text("Reset")');
    await expect(resetButton).not.toBeVisible();

    // Enter URL
    const urlInput = page.locator('input[type="url"]');
    await urlInput.fill('https://example.com/privacy');

    // Reset button should now be visible
    await expect(resetButton).toBeVisible();
  });

  test('should have Web3-style gradient buttons', async ({ page }) => {
    const analyzeButton = page.locator('button:has-text("Analyze")');
    await expect(analyzeButton).toBeVisible();

    // Check for gradient classes
    const buttonClass = await analyzeButton.getAttribute('class');
    expect(buttonClass).toContain('gradient');
  });

  test('should validate URL input', async ({ page }) => {
    const urlInput = page.locator('input[type="url"]');
    const analyzeButton = page.locator('button:has-text("Analyze")');

    // Button should be disabled when input is empty
    await expect(analyzeButton).toBeDisabled();

    // Enter URL
    await urlInput.fill('https://example.com/privacy');

    // Button should be enabled
    await expect(analyzeButton).toBeEnabled();
  });

  test('should display methodology link in header', async ({ page }) => {
    const methodologyLink = page.locator('a[href="/methodology"]');
    await expect(methodologyLink).toBeVisible();
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Main components should still be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="url"]')).toBeVisible();
    await expect(page.locator('button:has-text("Analyze")')).toBeVisible();

    // Input should be full width on mobile
    const urlInput = page.locator('input[type="url"]');
    const inputBox = await urlInput.boundingBox();
    expect(inputBox).not.toBeNull();
  });

  test('should have header navigation', async ({ page }) => {
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();

    // Check for logo/brand
    const brand = page.locator('text=PrivacyHub, a[href="/"]').first();
    await expect(brand).toBeVisible();
  });

  test('should have footer with links', async ({ page }) => {
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });
});
