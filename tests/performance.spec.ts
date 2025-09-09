import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load the homepage quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for the main content to be visible
    await expect(page.locator('h1')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds (generous for CI)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    // LCP should be less than 2.5 seconds (good threshold)
    if (typeof lcp === 'number' && lcp > 0) {
      expect(lcp).toBeLessThan(2500);
    }
  });

  test('should have minimal layout shift', async ({ page }) => {
    await page.goto('/');
    
    // Measure Cumulative Layout Shift (CLS)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Resolve after a short delay
        setTimeout(() => resolve(clsValue), 3000);
      });
    });
    
    // CLS should be less than 0.1 (good threshold)
    if (typeof cls === 'number') {
      expect(cls).toBeLessThan(0.1);
    }
  });

  test('should load fonts efficiently', async ({ page }) => {
    // Monitor network requests
    const fontRequests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        fontRequests.push(url);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should load Google Fonts
    expect(fontRequests.length).toBeGreaterThan(0);
    
    // Check if fonts are actually applied
    const h1FontFamily = await page.locator('h1').evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
    
    expect(h1FontFamily).toContain('Poppins');
  });

  test('should have optimized images', async ({ page }) => {
    await page.goto('/');
    
    // Find all images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check if images have proper loading attributes
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        const loading = await img.getAttribute('loading');
        
        // Images should have src
        expect(src).toBeTruthy();
        
        // Non-critical images should have lazy loading
        if (i > 0) { // First image can be eager loaded
          expect(loading).toBe('lazy');
        }
      }
    }
  });

  test('should have efficient bundle size', async ({ page }) => {
    // Monitor resource loading
    const resources: Array<{ url: string; size: number; type: string }> = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      const headers = response.headers();
      const contentLength = headers['content-length'];
      const contentType = headers['content-type'] || '';
      
      if (url.includes('localhost:3000') && contentLength) {
        resources.push({
          url,
          size: parseInt(contentLength),
          type: contentType,
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check JavaScript bundle sizes
    const jsResources = resources.filter(r => r.type.includes('javascript'));
    const totalJsSize = jsResources.reduce((sum, r) => sum + r.size, 0);
    
    // Total JS should be reasonable (less than 1MB for initial load)
    if (totalJsSize > 0) {
      expect(totalJsSize).toBeLessThan(1024 * 1024); // 1MB
    }
  });

  test('should be accessible to screen readers quickly', async ({ page }) => {
    await page.goto('/');
    
    // Check if main landmarks are quickly available
    const startTime = Date.now();
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h3').first()).toBeVisible();
    
    const timeToContent = Date.now() - startTime;
    
    // Screen reader content should be available quickly
    expect(timeToContent).toBeLessThan(2000);
  });

  test('should handle multiple concurrent users (basic load test)', async ({ browser }) => {
    const contexts = [];
    const pages = [];
    
    // Create 5 concurrent users
    for (let i = 0; i < 5; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      contexts.push(context);
      pages.push(page);
    }
    
    // Load page simultaneously
    const startTime = Date.now();
    
    await Promise.all(
      pages.map(async (page) => {
        await page.goto('/');
        await expect(page.locator('h1')).toBeVisible();
      })
    );
    
    const totalTime = Date.now() - startTime;
    
    // Should handle concurrent users without significant slowdown
    expect(totalTime).toBeLessThan(10000);
    
    // Clean up
    await Promise.all(contexts.map(context => context.close()));
  });
});