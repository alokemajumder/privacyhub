import { PrivacyPolicyContent } from '../types';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to get visitor's browser details
const getVisitorBrowserDetails = (): {
  userAgent: string;
  acceptLanguage: string;
  acceptHeader: string;
  ipAddress: string;
} => {
  return {
    userAgent: navigator.userAgent || '',
    acceptLanguage: navigator.languages ? navigator.languages.join(',') : navigator.language || '',
    acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    ipAddress: '' // This will be populated by the server if available
  };
};

/**
 * Fetch privacy policy content using enhanced HTTP requests
 */
export const fetchPrivacyPolicyWithBrowser = async (
  url: string,
  setAnalysisStage?: (stage: string) => void
): Promise<PrivacyPolicyContent> => {
  try {
    if (setAnalysisStage) {
      setAnalysisStage('Fetching policy content with enhanced HTTP');
    }
    
    // Add a random delay to avoid rate limiting
    await delay(500 + Math.random() * 1500);
    
    // Get visitor's browser details
    const visitorDetails = getVisitorBrowserDetails();
    
    // Enhanced CORS proxies with better reliability
    const corsProxies = [
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`,
      `https://cors.eu.org/${url}`,
      `https://proxy.cors.sh/${url}`
    ];
    
    let html = '';
    let error = null;
    
    // Try each proxy until one works
    for (const proxyUrl of corsProxies) {
      try {
        const response = await axios.get(proxyUrl, {
          timeout: 15000, // 15 second timeout
          headers: {
            'User-Agent': visitorDetails.userAgent,
            'Accept': visitorDetails.acceptHeader,
            'Accept-Language': visitorDetails.acceptLanguage,
            'Referer': 'https://www.google.com/',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'X-Forwarded-For': visitorDetails.ipAddress || undefined, // Include visitor's IP if available
            'X-Real-IP': visitorDetails.ipAddress || undefined // Alternative IP header
          }
        });
        
        if (response.data) {
          html = response.data;
          break; // Exit the loop if successful
        }
      } catch (e) {
        error = e;
        console.log(`Proxy ${proxyUrl} failed, trying next one...`);
        continue; // Try the next proxy
      }
    }
    
    // If all proxies failed, throw the last error
    if (!html) {
      console.error('All proxies failed:', error);
      throw new Error('Failed to fetch content from any proxy');
    }
    
    const $ = cheerio.load(html);
    
    // Extract the page title
    const title = $('title').text().trim() || new URL(url).hostname;
    
    // Extract the main content - focus on common privacy policy containers
    let content = '';
    
    // Try to find the main content container
    const possibleContainers = [
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
    
    for (const container of possibleContainers) {
      const containerContent = $(container).text().trim();
      if (containerContent && containerContent.length > content.length) {
        content = containerContent;
      }
    }
    
    // If no container found, use the body content
    if (!content) {
      // Remove scripts, styles, and navigation elements
      $('script, style, nav, header, footer, aside, .sidebar, .menu, .navigation, .ad, .advertisement, .banner').remove();
      content = $('body').text().trim();
    }
    
    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
    
    // If content is still empty or too short to be a privacy policy, throw an error
    if (!content || content.length < 500) {
      throw new Error('Could not extract meaningful content from the page. This may not be a privacy policy page.');
    }
    
    // Check if the content looks like a privacy policy
    const privacyKeywords = ['privacy', 'personal data', 'information we collect', 'cookies', 'gdpr', 'ccpa', 'third party', 'third parties'];
    const containsPrivacyKeywords = privacyKeywords.some(keyword => content.toLowerCase().includes(keyword.toLowerCase()));
    
    if (!containsPrivacyKeywords) {
      throw new Error('The content does not appear to be a privacy policy. Please check the URL and try again.');
    }
    
    const hostname = new URL(url).hostname.replace('www.', '');
    const favicon = `https://www.google.com/s2/favicons?domain=${url}&sz=128`;
    
    return {
      url,
      title,
      content,
      hostname,
      favicon
    };
  } catch (error) {
    console.error('Error in enhanced HTTP fetching:', error);
    throw new Error(`Failed to fetch privacy policy: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Find privacy policy URL using enhanced HTTP requests
 */
export const findPrivacyPolicyUrlWithBrowser = async (
  domain: string,
  setAnalysisStage?: (stage: string) => void
): Promise<string> => {
  try {
    if (setAnalysisStage) {
      setAnalysisStage('Searching for privacy policy with enhanced HTTP');
    }
    
    // Ensure domain has protocol
    if (!domain.startsWith('http')) {
      domain = 'https://' + domain;
    }
    
    // Remove trailing slash if present
    if (domain.endsWith('/')) {
      domain = domain.slice(0, -1);
    }
    
    // Add a random delay to avoid rate limiting
    await delay(500 + Math.random() * 1000);
    
    // Get visitor's browser details
    const visitorDetails = getVisitorBrowserDetails();
    
    // Try to fetch the homepage first to look for privacy policy links
    try {
      const corsProxy = `https://corsproxy.io/?${encodeURIComponent(domain)}`;
      const response = await axios.get(corsProxy, {
        timeout: 15000,
        headers: {
          'User-Agent': visitorDetails.userAgent,
          'Accept': visitorDetails.acceptHeader,
          'Accept-Language': visitorDetails.acceptLanguage,
          'Referer': 'https://www.google.com/',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'X-Forwarded-For': visitorDetails.ipAddress || undefined, // Include visitor's IP if available
          'X-Real-IP': visitorDetails.ipAddress || undefined // Alternative IP header
        }
      });
      
      if (response.data) {
        const $ = cheerio.load(response.data);
        
        // Look for links containing privacy-related keywords
        const privacyKeywords = ['privacy', 'policy', 'data', 'personal information', 'gdpr', 'ccpa'];
        const links = $('a');
        
        for (let i = 0; i < links.length; i++) {
          const link = $(links[i]);
          const href = link.attr('href');
          const text = link.text().toLowerCase();
          
          if (href && privacyKeywords.some(keyword => text.includes(keyword))) {
            // Construct absolute URL if relative
            let privacyUrl = href;
            if (href.startsWith('/')) {
              privacyUrl = domain + href;
            } else if (!href.startsWith('http')) {
              privacyUrl = domain + '/' + href;
            }
            
            console.log('Found privacy policy link:', privacyUrl);
            return privacyUrl;
          }
        }
      }
    } catch (error) {
      console.log('Error fetching homepage:', error);
      // Continue to try common paths
    }
    
    // Common privacy policy paths to check
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
    
    // If no link found on homepage, try common paths
    for (const path of commonPaths) {
      const url = domain + path;
      try {
        // Add a random delay to avoid rate limiting
        await delay(300 + Math.random() * 700);
        
        const corsProxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const response = await axios.head(corsProxy, {
          timeout: 8000,
          headers: {
            'User-Agent': visitorDetails.userAgent,
            'Accept': visitorDetails.acceptHeader,
            'Accept-Language': visitorDetails.acceptLanguage,
            'Referer': 'https://www.google.com/',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'X-Forwarded-For': visitorDetails.ipAddress || undefined, // Include visitor's IP if available
            'X-Real-IP': visitorDetails.ipAddress || undefined // Alternative IP header
          }
        });
        
        if (response.status === 200) {
          console.log('Found privacy policy at common path:', url);
          return url;
        }
      } catch (error) {
        console.log(`Path ${path} not found, trying next...`);
        continue;
      }
    }
    
    // If all else fails, just return the domain (we'll try to find the policy on the main page)
    console.log('No privacy policy found, using domain:', domain);
    return domain; // Return the original domain as fallback
  } catch (error) {
    console.error('Error finding privacy policy URL:', error);
    return domain; // Return the original domain as fallback
  }
};

/**
 * Clean up browser resources - this is a no-op since we're not using a browser
 */
export const cleanupBrowserResources = async (): Promise<void> => {
  // No browser resources to clean up
  return Promise.resolve();
};