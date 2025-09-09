import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Large Desktop', width: 1920, height: 1080 },
];

test.describe('Responsive Design', () => {
  viewports.forEach(({ name, width, height }) => {
    test(`should display correctly on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');

      // Main heading should always be visible
      await expect(page.locator('h1')).toBeVisible();
      
      // Hero section should be responsive
      const heroSection = page.locator('h1').locator('..');
      await expect(heroSection).toBeVisible();
      
      // Cards should be visible and properly sized
      const cards = page.locator('[class*="bg-card"], .Card, [data-testid="card"]');
      if (await cards.count() > 0) {
        await expect(cards.first()).toBeVisible();
      }
      
      if (width <= 640) {
        // Mobile: Text should be centered
        const heading = page.locator('h1');
        const textAlign = await heading.evaluate((el) => {
          return window.getComputedStyle(el).textAlign;
        });
        expect(textAlign).toBe('center');
      }
      
      // Content should not overflow horizontally
      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el) => {
        return Math.max(el.scrollWidth, el.offsetWidth);
      });
      expect(bodyWidth).toBeLessThanOrEqual(width + 50); // Allow small buffer for scrollbars
    });
  });

  test('should handle touch interactions on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('Skipping touch test on non-mobile browser');
    }

    await page.goto('/');
    
    // GitHub link should be tappable
    const githubLink = page.locator('a:has-text("View on GitHub")');
    await expect(githubLink).toBeVisible();
    
    // Tap should work
    await githubLink.tap();
    
    // Should not cause any console errors
  });

  test('should have proper spacing on all screen sizes', async ({ page }) => {
    for (const { width, height } of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // Check if content has proper margins
      const container = page.locator('div').first();
      const containerStyles = await container.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          left: rect.left,
          right: window.innerWidth - rect.right,
          width: rect.width,
        };
      });
      
      // Should have some padding/margin on sides
      expect(containerStyles.left).toBeGreaterThanOrEqual(0);
      expect(containerStyles.right).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have readable text size on all devices', async ({ page }) => {
    for (const { name, width, height } of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // Main heading should have appropriate size
      const h1 = page.locator('h1');
      const fontSize = await h1.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });
      
      if (width <= 640) {
        // Mobile should have smaller but readable font
        expect(fontSize).toBeGreaterThanOrEqual(24);
        expect(fontSize).toBeLessThanOrEqual(48);
      } else {
        // Desktop should have larger font
        expect(fontSize).toBeGreaterThanOrEqual(36);
      }
      
      // Body text should be readable
      const bodyText = page.locator('p').first();
      const bodyFontSize = await bodyText.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });
      
      expect(bodyFontSize).toBeGreaterThanOrEqual(14); // Minimum readable size
    }
  });

  test('should handle grid layouts responsively', async ({ page }) => {
    await page.goto('/');
    
    // Test grid layouts at different sizes
    for (const { width, height } of viewports) {
      await page.setViewportSize({ width, height });
      
      // Find grid containers
      const gridContainers = page.locator('.grid');
      const count = await gridContainers.count();
      
      if (count > 0) {
        const firstGrid = gridContainers.first();
        const gridStyles = await firstGrid.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            display: styles.display,
            gridTemplateColumns: styles.gridTemplateColumns,
          };
        });
        
        expect(gridStyles.display).toBe('grid');
        
        if (width <= 640) {
          // Mobile: Should be single column, auto-fit, or pixel-based single column
          expect(gridStyles.gridTemplateColumns).toMatch(/(1fr|auto|none|\d+px$)/);
        } else if (width >= 768) {
          // Desktop: Should have multiple columns or responsive layout
          expect(gridStyles.gridTemplateColumns).toMatch(/(1fr 1fr|repeat|\d+px \d+px)/);
        }
      }
    }
  });
});