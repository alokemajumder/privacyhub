import puppeteer from 'puppeteer-core';
import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from 'chrome-aws-lambda';

// Add stealth plugin to puppeteer
const puppeteerExtra = addExtra(puppeteer);
puppeteerExtra.use(StealthPlugin());

// Browser instance cache
let browserInstance: puppeteer.Browser | null = null;

/**
 * Get a browser instance, reusing an existing one if available
 */
export const getBrowser = async (): Promise<puppeteer.Browser> => {
  if (browserInstance) {
    return browserInstance;
  }

  try {
    // Try to use chrome-aws-lambda for compatibility with serverless environments
    const executablePath = await chromium.executablePath;
    
    if (executablePath) {
      browserInstance = await puppeteerExtra.launch({
        executablePath,
        headless: true,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        ignoreHTTPSErrors: true,
      });
    } else {
      // Fallback to default Chrome paths
      const possiblePaths = [
        // macOS Chrome
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        // Windows Chrome
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        // Linux Chrome
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        // Edge paths
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        '/usr/bin/microsoft-edge',
      ];

      // Try each path until one works
      for (const path of possiblePaths) {
        try {
          browserInstance = await puppeteerExtra.launch({
            executablePath: path,
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--disable-gpu',
              '--window-size=1920,1080',
            ],
            ignoreHTTPSErrors: true,
          });
          break;
        } catch (e) {
          console.log(`Failed to launch with path: ${path}`);
          continue;
        }
      }

      // If all paths failed, try without specifying executablePath
      if (!browserInstance) {
        browserInstance = await puppeteerExtra.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920,1080',
          ],
          ignoreHTTPSErrors: true,
        });
      }
    }

    // Set up cleanup on process exit
    process.on('exit', () => {
      if (browserInstance) {
        browserInstance.close().catch(console.error);
      }
    });

    return browserInstance;
  } catch (error) {
    console.error('Failed to launch browser:', error);
    throw new Error('Failed to launch browser. Please make sure Chrome is installed.');
  }
};

/**
 * Close the browser instance if it exists
 */
export const closeBrowser = async (): Promise<void> => {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
};

/**
 * Fetch a page content using Puppeteer with stealth mode
 */
export const fetchPageContent = async (url: string): Promise<{
  content: string;
  title: string;
  links: { url: string; text: string }[];
}> => {
  let browser: puppeteer.Browser | null = null;
  let page: puppeteer.Page | null = null;

  try {
    // Get browser instance
    browser = await getBrowser();
    
    // Create a new page
    page = await browser.newPage();
    
    // Set a realistic viewport
    await page.setViewport({ width: 1366, height: 768 });
    
    // Set a realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // Set extra headers to appear more like a real browser
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'https://www.google.com/'
    });
    
    // Navigate to the URL with a timeout
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait a bit for any lazy-loaded content or scripts to execute
    await page.waitForTimeout(2000);
    
    // Get the page title
    const title = await page.title();
    
    // Extract all links from the page
    const links = await page.evaluate(() => {
      const linkElements = Array.from(document.querySelectorAll('a'));
      return linkElements.map(link => ({
        url: link.href,
        text: link.textContent?.trim() || ''
      }));
    });
    
    // Get the page content
    const content = await page.evaluate(() => {
      // Try to find privacy policy specific containers first
      const privacyContainers = [
        'main',
        'article',
        '.privacy-policy',
        '.privacy',
        '#privacy-policy',
        '#privacy',
        '.container',
        '.content',
        '.main-content',
        '[role="main"]',
        '.entry-content',
        '.post-content',
        '.page-content',
        '.terms-content',
        '.legal-content'
      ];
      
      for (const selector of privacyContainers) {
        const container = document.querySelector(selector);
        if (container && container.textContent && container.textContent.trim().length > 500) {
          return container.textContent.trim();
        }
      }
      
      // If no container found, remove unwanted elements and get body content
      const elementsToRemove = [
        'script',
        'style',
        'nav',
        'header',
        'footer',
        'aside',
        '.sidebar',
        '.menu',
        '.navigation',
        '.ad',
        '.advertisement',
        '.banner',
        '.cookie-banner',
        '.cookie-consent',
        '.gdpr-banner',
        '.gdpr-consent'
      ];
      
      // Clone the document body to avoid modifying the actual page
      const bodyClone = document.body.cloneNode(true) as HTMLElement;
      
      // Remove unwanted elements from the clone
      elementsToRemove.forEach(selector => {
        const elements = bodyClone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
      
      return bodyClone.textContent?.trim() || '';
    });
    
    return { content, title, links };
  } catch (error) {
    console.error('Error in fetchPageContent:', error);
    throw new Error(`Failed to fetch page content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Close the page but keep the browser instance for reuse
    if (page) {
      await page.close().catch(console.error);
    }
  }
};

/**
 * Find a privacy policy URL on a website using Puppeteer
 */
export const findPrivacyPolicyUrl = async (domain: string): Promise<string> => {
  let browser: puppeteer.Browser | null = null;
  let page: puppeteer.Page | null = null;

  try {
    // Ensure domain has protocol
    if (!domain.startsWith('http')) {
      domain = 'https://' + domain;
    }
    
    // Remove trailing slash if present
    if (domain.endsWith('/')) {
      domain = domain.slice(0, -1);
    }
    
    // Get browser instance
    browser = await getBrowser();
    
    // Create a new page
    page = await browser.newPage();
    
    // Set a realistic viewport
    await page.setViewport({ width: 1366, height: 768 });
    
    // Set a realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // Set extra headers to appear more like a real browser
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'https://www.google.com/'
    });
    
    // Navigate to the domain homepage
    await page.goto(domain, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait a bit for any lazy-loaded content or scripts to execute
    await page.waitForTimeout(2000);
    
    // Look for privacy policy links on the homepage
    const privacyLinks = await page.evaluate(() => {
      const privacyKeywords = ['privacy', 'policy', 'data', 'personal information', 'gdpr', 'ccpa'];
      const links = Array.from(document.querySelectorAll('a'));
      
      const potentialLinks = links
        .filter(link => {
          const text = link.textContent?.toLowerCase().trim() || '';
          const href = link.getAttribute('href') || '';
          return privacyKeywords.some(keyword => 
            text.includes(keyword) || href.includes(keyword)
          );
        })
        .map(link => {
          const href = link.getAttribute('href') || '';
          const text = link.textContent?.trim() || '';
          
          // Construct absolute URL if relative
          let absoluteUrl = href;
          if (href.startsWith('/')) {
            absoluteUrl = window.location.origin + href;
          } else if (!href.startsWith('http')) {
            absoluteUrl = window.location.origin + '/' + href;
          }
          
          return { url: absoluteUrl, text };
        });
      
      return potentialLinks;
    });
    
    // If we found privacy links, return the first one
    if (privacyLinks.length > 0) {
      console.log('Found privacy policy links:', privacyLinks);
      return privacyLinks[0].url;
    }
    
    // If no links found on homepage, try common paths
    const commonPaths = [
      '/privacy',
      '/privacy-policy',
      '/privacy/policy',
      '/legal/privacy',
      '/legal/privacy-policy',
      '/about/privacy',
      '/en/privacy',
      '/privacy-notice',
      '/privacy-statement',
      '/data-policy',
      '/data-privacy',
      '/terms-privacy',
      '/help/privacy',
      '/policies/privacy',
      '/legal/terms-and-privacy',
      '/about/legal/privacy-policy',
      '/legal/privacy-notice',
      '/privacy-center',
      '/privacy-hub',
      '/privacy-information'
    ];
    
    for (const path of commonPaths) {
      const url = domain + path;
      try {
        // Try to navigate to the potential privacy policy URL
        const response = await page.goto(url, { 
          waitUntil: 'networkidle2',
          timeout: 10000 
        });
        
        // Check if the page exists (status code 200)
        if (response && response.status() === 200) {
          // Check if the page content looks like a privacy policy
          const pageContent = await page.evaluate(() => document.body.textContent || '');
          const privacyKeywords = ['privacy', 'personal data', 'information we collect', 'cookies', 'gdpr', 'ccpa'];
          
          if (privacyKeywords.some(keyword => pageContent.toLowerCase().includes(keyword.toLowerCase()))) {
            console.log('Found privacy policy at common path:', url);
            return url;
          }
        }
      } catch (error) {
        console.log(`Path ${path} not found or error, trying next...`);
        continue;
      }
    }
    
    // If all else fails, just return the domain
    console.log('No privacy policy found, using domain:', domain);
    return domain;
  } catch (error) {
    console.error('Error finding privacy policy URL:', error);
    return domain; // Return the original domain as fallback
  } finally {
    // Close the page but keep the browser instance for reuse
    if (page) {
      await page.close().catch(console.error);
    }
  }
};