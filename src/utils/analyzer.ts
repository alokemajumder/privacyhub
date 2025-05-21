import { PrivacyAnalysis, PrivacyPolicyContent } from '../types';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { analyzePrivacyPolicyWithAI } from './aiAnalyzer';
import { toast } from 'react-toastify';
import { fetchPrivacyPolicyWithBrowser, findPrivacyPolicyUrlWithBrowser, cleanupBrowserResources } from './browserCrawler';
import { saveAnalysis } from '../lib/db';

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

// Function to fetch and extract content from a privacy policy URL
export const fetchPrivacyPolicyContent = async (
  url: string, 
  setAnalysisStage?: (stage: string) => void
): Promise<PrivacyPolicyContent> => {
  try {
    if (setAnalysisStage) {
      setAnalysisStage('Fetching policy content');
    }
    
    // First try browser-based crawling
    try {
      return await fetchPrivacyPolicyWithBrowser(url, setAnalysisStage);
    } catch (browserError) {
      console.log('Browser-based crawling failed, falling back to HTTP requests:', browserError);
      // Continue with HTTP-based crawling
    }
    
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
    
    // Get visitor's browser details
    const visitorDetails = getVisitorBrowserDetails();
    
    // Try each proxy until one works
    for (const proxyUrl of corsProxies) {
      try {
        // Add a random delay between 500ms and 2000ms to avoid rate limiting
        await delay(500 + Math.random() * 1500);
        
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
      throw new Error('Failed to fetch content from any proxy. The website may be blocking our requests or is unavailable.');
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
    console.error('Error fetching privacy policy:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to fetch privacy policy content. The website may be blocking our requests or is unavailable.');
    }
  }
};

// Function to find privacy policy URL from a domain
export const findPrivacyPolicyUrl = async (
  domain: string,
  setAnalysisStage?: (stage: string) => void
): Promise<string> => {
  try {
    if (setAnalysisStage) {
      setAnalysisStage('Searching for privacy policy');
    }
    
    // Ensure domain has protocol
    if (!domain.startsWith('http')) {
      domain = 'https://' + domain;
    }
    
    // Remove trailing slash if present
    if (domain.endsWith('/')) {
      domain = domain.slice(0, -1);
    }
    
    // First try browser-based crawling
    try {
      return await findPrivacyPolicyUrlWithBrowser(domain, setAnalysisStage);
    } catch (browserError) {
      console.log('Browser-based URL finding failed, falling back to HTTP requests:', browserError);
      // Continue with HTTP-based crawling
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
    
    // Get visitor's browser details
    const visitorDetails = getVisitorBrowserDetails();
    
    // Try to fetch the homepage first to look for privacy policy links
    try {
      // Add a random delay to avoid rate limiting
      await delay(500 + Math.random() * 1000);
      
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
    
    // If all else fails, throw an error
    console.log('No privacy policy found for domain:', domain);
    throw new Error('Could not automatically locate the privacy policy URL for this domain. Please try providing a direct link to the privacy policy.');
  } catch (error) {
    console.error('Error finding privacy policy URL:', error);
    if (error instanceof Error) {
      throw error; // Re-throw the original error
    }
    // If it's not an Error instance, wrap it or throw a generic one
    throw new Error('An unknown error occurred while trying to find the privacy policy URL.');
  }
};

// Main function to analyze a privacy policy
export const analyzePrivacyPolicy = async (
  url: string,
  setAnalysisStage?: (stage: string) => void
): Promise<PrivacyAnalysis> => {
  try {
    // If URL is just a domain, find the privacy policy URL
    if (!url.includes('/')) {
      url = await findPrivacyPolicyUrl(url, setAnalysisStage);
    }
    
    // Fetch the privacy policy content
    const policyContent = await fetchPrivacyPolicyContent(url, setAnalysisStage);
    
    if (setAnalysisStage) {
      setAnalysisStage('Analyzing with AI');
    }
    
    // Analyze the content with AI
    const aiAnalysis = await analyzePrivacyPolicyWithAI(policyContent.content);
    
    // Validate the analysis results
    if (!aiAnalysis.scores || aiAnalysis.scores.length === 0) {
      throw new Error('Failed to analyze the privacy policy content. The AI could not generate scores.');
    }
    
    if (setAnalysisStage) {
      setAnalysisStage('Calculating scores');
    }
    
    // Calculate total score
    const totalScore = aiAnalysis.scores.reduce((sum, score) => sum + score.score, 0);
    const maxTotalScore = aiAnalysis.scores.reduce((sum, score) => sum + score.maxScore, 0);
    
    // Generate screenshot URL using a screenshot service
    const screenshotUrl = `https://image.thum.io/get/width/600/crop/400/viewportWidth/1200/png/noanimate/${url}`;
    
    // Create the analysis object
    const analysis: PrivacyAnalysis = {
      siteName: policyContent.title.split(' - ')[0].split(' | ')[0].trim(),
      siteUrl: url,
      logoUrl: policyContent.favicon,
      screenshotUrl,
      scores: aiAnalysis.scores,
      totalScore,
      maxTotalScore,
      summary: aiAnalysis.summary,
      analysisDate: new Date().toISOString().split('T')[0],
      lastUpdated: Date.now()
    };
    
    // Save to IndexedDB
    if (setAnalysisStage) {
      setAnalysisStage('Saving results');
    }
    
    const savedAnalysis = await saveAnalysis(analysis);
    
    // Clean up browser resources
    await cleanupBrowserResources();
    
    return savedAnalysis;
  } catch (error) {
    console.error('Error in analyzePrivacyPolicy:', error);
    
    // Clean up browser resources even on error
    await cleanupBrowserResources();
    
    throw error;
  }
};