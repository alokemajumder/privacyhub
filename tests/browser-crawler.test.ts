import { describe, it, expect, afterAll } from 'vitest';
import { fetchPrivacyPolicyWithBrowser, findPrivacyPolicyUrlWithBrowser, cleanupBrowserResources } from '../src/utils/browserCrawler';

describe('Browser Crawler Tests', () => {
  // Clean up after all tests
  afterAll(async () => {
    await cleanupBrowserResources();
  });
  
  it('should find a privacy policy URL from a domain', async () => {
    // Use a well-known site that definitely has a privacy policy
    const domain = 'https://www.google.com';
    const policyUrl = await findPrivacyPolicyUrlWithBrowser(domain);
    
    // The URL should be different from the domain and contain privacy-related keywords
    expect(policyUrl).not.toBe(domain);
    expect(policyUrl.toLowerCase()).toMatch(/privacy|policy|data/);
  }, 30000); // Increase timeout for browser tests
  
  it('should fetch and extract privacy policy content', async () => {
    // Use Google's privacy policy URL
    const url = 'https://policies.google.com/privacy';
    const policyContent = await fetchPrivacyPolicyWithBrowser(url);
    
    // Verify the content structure
    expect(policyContent).toHaveProperty('url');
    expect(policyContent).toHaveProperty('title');
    expect(policyContent).toHaveProperty('content');
    expect(policyContent).toHaveProperty('hostname');
    expect(policyContent).toHaveProperty('favicon');
    
    // Content should be substantial
    expect(policyContent.content.length).toBeGreaterThan(1000);
    
    // Content should contain privacy-related keywords
    expect(policyContent.content.toLowerCase()).toMatch(/privacy|data|information|collect/);
  }, 30000); // Increase timeout for browser tests
  
  it('should handle sites with non-standard privacy policy locations', async () => {
    // Use a site that might have a less obvious privacy policy location
    const domain = 'https://www.github.com';
    const policyUrl = await findPrivacyPolicyUrlWithBrowser(domain);
    
    // Should find a privacy-related URL
    expect(policyUrl.toLowerCase()).toMatch(/privacy|policy|data|terms/);
  }, 30000); // Increase timeout for browser tests
});