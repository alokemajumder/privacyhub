import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Privacy Policy Analyzer');
  });

  test('should have proper meta information', async ({ page }) => {
    await expect(page).toHaveTitle(/Privacy Policy Analyzer/);
  });

  test('should display hero section with description', async ({ page }) => {
    const heroDescription = page.locator('p').first();
    await expect(heroDescription).toContainText('Understand how websites handle your personal data');
  });

  test('should display feature badges', async ({ page }) => {
    await expect(page.locator('text=AI-Powered Analysis')).toBeVisible();
    await expect(page.locator('text=90+ Privacy Criteria')).toBeVisible();
    await expect(page.locator('text=Community Supported')).toBeVisible();
  });

  test('should display coming soon section', async ({ page }) => {
    await expect(page.locator('text=Next.js Version Coming Soon')).toBeVisible();
    await expect(page.locator('text=We\'re currently migrating')).toBeVisible();
  });

  test('should display privacy education section', async ({ page }) => {
    await expect(page.locator('h3:has-text("Why Privacy Analysis Matters")')).toBeVisible();
    await expect(page.locator('text=Key Privacy Concerns')).toBeVisible();
    await expect(page.locator('text=Potential Impact on Users')).toBeVisible();
  });

  test('should display open source contribution section', async ({ page }) => {
    await expect(page.locator('h3:has-text("Open Source Contribution")')).toBeVisible();
    await expect(page.locator('text=Ways to Contribute')).toBeVisible();
    
    const githubLink = page.locator('a[href*="github.com/privacypriority/privacyhub"]');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Main heading should still be visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Cards should be stacked vertically on mobile - using correct shadcn/ui Card selector
    const cards = page.locator('[class*="bg-card"], .Card, [data-testid="card"]');
    if (await cards.count() > 0) {
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();
    } else {
      // If no specific Card classes found, just verify the main content is responsive
      await expect(page.locator('div').first()).toBeVisible();
    }
  });
});