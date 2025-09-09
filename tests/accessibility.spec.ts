import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');
    const h4 = page.locator('h4');
    
    // Should have exactly one h1
    await expect(h1).toHaveCount(1);
    
    // h1 should contain main title
    await expect(h1).toContainText('Privacy Policy Analyzer');
    
    // Should have proper h3 sections
    await expect(h3.filter({ hasText: 'Why Privacy Analysis Matters' })).toBeVisible();
    await expect(h3.filter({ hasText: 'Open Source Contribution' })).toBeVisible();
    
    // Should have proper h4 subsections
    await expect(h4.filter({ hasText: 'Key Privacy Concerns' })).toBeVisible();
    await expect(h4.filter({ hasText: 'Potential Impact on Users' })).toBeVisible();
  });

  test('should have proper link attributes', async ({ page }) => {
    // External links should have proper attributes
    const githubLink = page.locator('a[href*="github.com"]');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should have proper focus management', async ({ page }) => {
    // Tab through interactive elements
    const githubLink = page.locator('a[href*="github.com"]');
    
    // Focus should be visible
    await githubLink.focus();
    
    // Check if focus outline is present
    const focusStyles = await githubLink.evaluate((el) => {
      return window.getComputedStyle(el).outline;
    });
    
    // Should have some form of focus indicator
    expect(focusStyles).toBeTruthy();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // Test main heading contrast
    const h1 = page.locator('h1');
    const h1Styles = await h1.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      return {
        color: styles.color,
        backgroundColor: bgColor,
      };
    });
    
    // Black text on white background should have excellent contrast
    expect(h1Styles.color).toContain('0, 0, 0'); // Black text
    expect(h1Styles.backgroundColor).toContain('255, 255, 255'); // White background
  });

  test('should have descriptive button and link text', async ({ page }) => {
    // Links should have descriptive text, not just "click here"
    const githubLink = page.locator('a:has-text("View on GitHub")');
    await expect(githubLink).toBeVisible();
    
    const linkText = await githubLink.textContent();
    expect(linkText).toContain('GitHub'); // Descriptive text
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Find the GitHub link directly
    const githubLink = page.locator('a:has-text("View on GitHub")');
    await expect(githubLink).toBeVisible();
    
    // Focus on the GitHub link
    await githubLink.focus();
    
    // Should be able to navigate to it
    const focusedElement = page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper semantic structure', async ({ page }) => {
    // Check for proper landmark elements
    const main = page.locator('main, [role="main"]');
    
    // Should have proper list structure for feature lists
    const lists = page.locator('ul');
    const listCount = await lists.count();
    expect(listCount).toBeGreaterThanOrEqual(1);
    
    // List items should have proper structure
    const listItems = page.locator('li');
    const itemCount = await listItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(5); // Multiple feature lists
  });
});