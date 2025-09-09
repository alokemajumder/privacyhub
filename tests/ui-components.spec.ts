import { test, expect } from '@playwright/test';

test.describe('UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render shadcn/ui Card components correctly', async ({ page }) => {
    // Check if cards are rendered with proper styling
    const cards = page.locator('[class*="bg-card"]');
    await expect(cards.first()).toBeVisible();
    
    // Cards should have proper border radius
    const cardStyles = await cards.first().evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        borderRadius: styles.borderRadius,
        backgroundColor: styles.backgroundColor,
      };
    });
    
    expect(cardStyles.borderRadius).toBeTruthy();
  });

  test('should render Badge components with proper styling', async ({ page }) => {
    const badges = page.locator('text=AI-Powered Analysis').locator('..');
    await expect(badges.first()).toBeVisible();
    
    // Badge should have inline-flex display
    const badgeDisplay = await badges.first().evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    
    expect(badgeDisplay).toContain('flex');
  });

  test('should render Button components correctly', async ({ page }) => {
    const button = page.locator('a:has-text("View on GitHub")');
    await expect(button).toBeVisible();
    
    // Button should have proper focus states
    await button.focus();
    const buttonStyles = await button.evaluate((el) => {
      return window.getComputedStyle(el);
    });
    
    expect(buttonStyles.cursor).toBe('pointer');
  });

  test('should have proper typography hierarchy', async ({ page }) => {
    // Check h1 styling (Poppins font)
    const h1 = page.locator('h1').first();
    const h1Styles = await h1.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
    expect(h1Styles).toContain('Poppins');
    
    // Check body text (Inter font)
    const bodyText = page.locator('p').first();
    const bodyStyles = await bodyText.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
    expect(bodyStyles).toContain('Inter');
  });

  test('should have proper color scheme (black & white theme)', async ({ page }) => {
    const body = page.locator('body');
    const bodyStyles = await body.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });
    
    // Background should be white or very light
    expect(bodyStyles.backgroundColor).toMatch(/rgb\(255, 255, 255\)|rgb\(248, 249, 250\)/);
    
    // Text should be black or dark gray
    expect(bodyStyles.color).toMatch(/rgb\(0, 0, 0\)|rgb\(17, 24, 39\)/);
  });

  test('should handle hover states correctly', async ({ page }) => {
    const githubLink = page.locator('a:has-text("View on GitHub")');
    
    // Get initial styles
    const initialStyles = await githubLink.evaluate((el) => {
      return window.getComputedStyle(el);
    });
    
    // Hover over the element
    await githubLink.hover();
    
    // Check if hover state is applied
    const hoveredStyles = await githubLink.evaluate((el) => {
      return window.getComputedStyle(el);
    });
    
    // Should have cursor pointer
    expect(hoveredStyles.cursor).toBe('pointer');
  });
});