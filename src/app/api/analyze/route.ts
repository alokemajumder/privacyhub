import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import FirecrawlApp from '@mendable/firecrawl-js';
import { PlaywrightCrawler } from '@crawlee/playwright';
// Firebase/Firestore disabled - keeping code for future use
// import { saveAnalysis as saveSQLiteAnalysis } from '@/lib/database';
// import {
//   extractDomain,
//   generateContentHash,
//   checkExistingAnalysis,
//   saveAnalysis as saveFirestoreAnalysis,
//   updateLastChecked
// } from '@/lib/firestore-service';
// import { getOptimizedLogo } from '@/lib/logo-service';
// import { errorHandler, ErrorSeverity } from '@/lib/error-handler';
// import { analysisRateLimiter, getClientIp, createRateLimitHeaders } from '@/lib/rate-limiter';
import { validateUrl } from '@/lib/input-validation';

// Configure Vercel timeout (max 60 seconds on Pro plan, 10 seconds on Hobby)
export const maxDuration = 60; // seconds
export const dynamic = 'force-dynamic';

// Initialize OpenAI client inside the route handler to avoid build-time issues
function getOpenAIClient() {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API,
  });
}

// Initialize Firecrawl client
function getFirecrawlClient() {
  if (!process.env.FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY environment variable is required');
  }
  return new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
}

// Simple fetch fallback when Playwright is not available
async function scrapeWithFetch(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PrivacyHubBot/1.0; +https://privacyhub.com)',
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Basic HTML parsing to extract text content
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return textContent;
  } catch (error) {
    console.error('Fetch scraping failed:', error);
    throw error;
  }
}

// Crawlee PlaywrightCrawler fallback scraper (may not work on Vercel)
async function scrapeWithCrawlee(url: string): Promise<string> {
  let extractedContent = '';

  try {
    const crawler = new PlaywrightCrawler({
      // Limit to single request
      maxRequestsPerCrawl: 1,

      // Headless mode for production
      headless: true,

      // Browser launch options for Vercel compatibility
      launchContext: {
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
        },
      },

      // Request handler
      async requestHandler({ page, request }) {
        console.log(`Crawling: ${request.url}`);

        // Wait for page to load
        await page.waitForLoadState('domcontentloaded');

        // Wait a bit for dynamic content
        await page.waitForTimeout(2000);

        // Extract main content text
        extractedContent = await page.evaluate(() => {
          // Remove script and style elements
          const elementsToRemove = document.querySelectorAll('script, style, nav, header, footer, aside, [role="navigation"], [role="banner"], [role="complementary"]');
          elementsToRemove.forEach(el => el.remove());

          // Try to find main content areas
          const selectors = [
            'main',
            '[role="main"]',
            '.main-content',
            '#main-content',
            '.content',
            '#content',
            '.privacy-policy',
            '.policy-content',
            'article',
            '.article-content',
            '.post-content',
            '.entry-content',
            '.container',
            'body'
          ];

          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent && element.textContent.trim().length > 500) {
              return element.textContent.trim();
            }
          }

          // Fallback to body text
          return document.body.textContent?.trim() || '';
        });
      },

      // Error handler
      failedRequestHandler({ request }) {
        console.error(`Request ${request.url} failed multiple times`);
      },
    });

    // Run the crawler on the URL
    await crawler.run([url]);

    // Clean up
    await crawler.teardown();

    return extractedContent;
  } catch (error) {
    console.error('Crawlee scraping failed:', error);
    throw error;
  }
}

const PRIVACY_ANALYSIS_PROMPT = `
You are a certified privacy policy expert with expertise in GDPR, CCPA, DPDP Act 2023 (India), PIPEDA, and international data protection frameworks. Conduct a comprehensive privacy impact assessment using evidence-based evaluation criteria.

SCORING METHODOLOGY: Rate each category 1-10 (10 = exemplary privacy protection, 1 = significant privacy risk)

**DATA MINIMIZATION & COLLECTION PRACTICES (Weight: 30%)**
Evaluate against GDPR Art. 5(1)(c), DPDP Act 2023 Sec. 5, and privacy-by-design principles:
- Collection scope: Only necessary data for stated purposes (10), excessive collection without justification (1-3)
- Legal basis clarity: Explicit lawful basis identification (Art. 6 GDPR, Sec. 6 DPDP Act) 
- Purpose specification: Clear, specific purposes vs. vague "business operations"
- Sensitive data handling: Special category data protections (Art. 9 GDPR, Sec. 9 DPDP Act)
- Children's data: COPPA/GDPR-K/DPDP Act Sec. 9 compliance for minors
- Notice and consent: Clear, informed consent mechanisms per DPDP Act requirements

**THIRD-PARTY DATA SHARING & TRANSFERS (Weight: 25%)**
Assess data controller/processor relationships and transfer mechanisms:
- Sharing scope: No sharing (10), limited with consent (7-8), extensive commercial sharing (1-4)
- International transfers: Adequate country/SCCs/BCRs compliance (GDPR Ch. V, DPDP Act Sec. 16)
- Processor agreements: Evidence of Art. 28 GDPR/DPDP Act Sec. 8 compliant contracts
- Consent mechanisms: Granular, withdrawable consent vs. bundled/forced consent
- Cross-border transfers: DPDP Act restricted country compliance
- Commercial exploitation: Data monetization practices and user awareness

**INDIVIDUAL RIGHTS & DATA SUBJECT CONTROLS (Weight: 20%)**
Evaluate GDPR Chapter III and DPDP Act Chapter IV rights implementation:
- Access rights (Art. 15 GDPR, Sec. 11 DPDP Act): Comprehensive data access mechanisms
- Rectification (Art. 16 GDPR, Sec. 12 DPDP Act): Error correction processes
- Erasure (Art. 17 GDPR, Sec. 12 DPDP Act): Right to be forgotten/deletion implementation
- Portability (Art. 20 GDPR): Structured data export capabilities
- Objection (Art. 21 GDPR): Opt-out mechanisms for processing
- Withdrawal of consent (DPDP Act Sec. 7): Easy withdrawal mechanisms
- Grievance redressal (DPDP Act Sec. 32): Complaint handling procedures
- Response timeframes: Compliance with regulatory requirements (30 days GDPR, reasonable time DPDP)

**SECURITY & RISK MANAGEMENT (Weight: 15%)**
Technical and organizational measures assessment (GDPR Art. 32, DPDP Act Sec. 8):
- Encryption standards: End-to-end, in-transit, at-rest protections
- Access controls: Role-based access, multi-factor authentication
- Incident response: Breach notification procedures (72-hour GDPR, 72-hour DPDP Act requirements)
- Risk assessment: Regular privacy impact assessments
- Data retention: Defined, justified retention periods with deletion schedules
- Data localization: DPDP Act compliance for sensitive personal data storage

**REGULATORY COMPLIANCE & LEGAL FRAMEWORK (Weight: 7%)**
Multi-jurisdictional compliance evaluation:
- GDPR compliance indicators (EU users)
- CCPA compliance markers (California residents)
- DPDP Act 2023 compliance (Indian users): Registration requirements, Data Protection Officer
- Sectoral compliance (HIPAA, FERPA, GLBA where applicable)
- Privacy officer designation and contact information
- Legal basis documentation and consent records management
- Data Protection Board registration (DPDP Act Sec. 25) where required

**TRANSPARENCY & COMMUNICATION (Weight: 3%)**
Information quality and accessibility assessment:
- Language clarity: Plain language vs. legal jargon (Flesch-Kincaid readability)
- Policy accessibility: Layered notices, mobile optimization, vernacular language support
- Change notification: Proactive user notification mechanisms
- Contact mechanisms: Dedicated privacy contact/DPO information
- Grievance officer details (DPDP Act requirement)

RISK CATEGORIZATION:
- HIGH RISK (1-3): Significant privacy violations likely, regulatory action probable
- MODERATE-HIGH RISK (4-5): Multiple compliance gaps, user privacy compromised
- MODERATE RISK (6-7): Some privacy protections present, areas for improvement
- LOW RISK (8-9): Strong privacy framework with minor gaps
- EXEMPLARY (10): Privacy-by-design implementation, exceeds regulatory minimums

Provide your response in this JSON format:
{
  "overall_score": number (1-10, weighted average),
  "risk_level": "string (HIGH/MODERATE-HIGH/MODERATE/LOW/EXEMPLARY)",
  "regulatory_compliance": {
    "gdpr_compliance": "string (COMPLIANT/PARTIALLY_COMPLIANT/NON_COMPLIANT)",
    "ccpa_compliance": "string (COMPLIANT/PARTIALLY_COMPLIANT/NON_COMPLIANT/NOT_APPLICABLE)",
    "dpdp_act_compliance": "string (COMPLIANT/PARTIALLY_COMPLIANT/NON_COMPLIANT/NOT_APPLICABLE)",
    "major_violations": ["string array of specific regulatory violations"]
  },
  "categories": {
    "data_collection": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"},
    "data_sharing": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"}, 
    "user_rights": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"},
    "security_measures": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"},
    "compliance_framework": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"},
    "transparency": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"}
  },
  "critical_findings": {
    "high_risk_practices": ["specific practices that pose significant privacy risks"],
    "regulatory_gaps": ["compliance requirements not met"],
    "data_subject_impacts": ["potential harms to individuals"]
  },
  "positive_practices": ["privacy-protective practices that exceed minimum requirements"],
  "actionable_recommendations": {
    "immediate_actions": ["urgent compliance actions required"],
    "medium_term_improvements": ["privacy enhancements to implement"],
    "best_practice_adoption": ["industry leading practices to consider"]
  },
  "privacy_grade": "string (A+ to F based on risk level)",
  "executive_summary": "Professional 2-3 sentence assessment suitable for stakeholders"
}
`;

export async function POST(request: NextRequest) {
  try {
    console.log('Privacy analysis request received');

    // Rate limiting disabled for MVP
    // const clientIp = getClientIp(request);
    // const rateLimitCheck = analysisRateLimiter.check(clientIp);
    //
    // if (!rateLimitCheck.allowed) {
    //   const headers = createRateLimitHeaders(
    //     rateLimitCheck.remaining,
    //     rateLimitCheck.resetTime,
    //     5
    //   );
    //
    //   return NextResponse.json(
    //     {
    //       error: 'Rate limit exceeded. You can analyze up to 5 privacy policies every 15 minutes. Please try again later.',
    //       resetTime: new Date(rateLimitCheck.resetTime).toISOString()
    //     },
    //     { status: 429, headers }
    //   );
    // }

    const { url, turnstileToken } = await request.json();

    if (!url) {
      console.error('No URL provided in request');
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // TURNSTILE DISABLED - Keep code for future use
    // Verify Turnstile token (only if secret key is configured)
    // const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
    // if (turnstileSecretKey) {
    //   if (!turnstileToken) {
    //     console.error('[Turnstile] No token provided in request');
    //     return NextResponse.json({
    //       error: 'Security verification required. Please complete the security check.'
    //     }, { status: 400 });
    //   }

    //   try {
    //     console.log('[Turnstile] Validating token with Cloudflare...');

    //     // Get client IP for enhanced fraud detection
    //     const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    //                     request.headers.get('x-real-ip') ||
    //                     'unknown';

    //     const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         secret: turnstileSecretKey,
    //         response: turnstileToken,
    //         remoteip: clientIp, // Optional but recommended for fraud detection
    //       }),
    //     });

    //     const turnstileResult = await turnstileResponse.json() as {
    //       success: boolean;
    //       'error-codes'?: string[];
    //       challenge_ts?: string;
    //       hostname?: string;
    //       action?: string;
    //       cdata?: string;
    //     };

    //     if (!turnstileResult.success) {
    //       const errorCodes = turnstileResult['error-codes'] || [];
    //       console.error('[Turnstile] Verification failed:', errorCodes);

    //       // Provide specific error messages based on error codes
    //       let errorMessage = 'Security verification failed. Please try again.';
    //       if (errorCodes.includes('timeout-or-duplicate')) {
    //         errorMessage = 'Security token has expired or was already used. Please refresh and try again.';
    //       } else if (errorCodes.includes('invalid-input-response')) {
    //         errorMessage = 'Invalid security token. Please refresh the page and try again.';
    //       } else if (errorCodes.includes('internal-error')) {
    //         errorMessage = 'Security service temporarily unavailable. Please try again.';
    //       }

    //       return NextResponse.json({ error: errorMessage }, { status: 403 });
    //     }

    //     // Validate hostname matches your domain (security best practice)
    //     const expectedHostnames = ['privacyhub.in', 'www.privacyhub.in', 'localhost'];
    //     if (turnstileResult.hostname && !expectedHostnames.includes(turnstileResult.hostname)) {
    //       console.error('[Turnstile] Hostname mismatch:', turnstileResult.hostname);
    //       return NextResponse.json({
    //         error: 'Security verification failed: invalid origin.'
    //       }, { status: 403 });
    //     }

    //     console.log('[Turnstile] Verification successful', {
    //       hostname: turnstileResult.hostname,
    //       challenge_ts: turnstileResult.challenge_ts,
    //       clientIp: clientIp.substring(0, 10) + '...' // Log partial IP for privacy
    //     });
    //   } catch (turnstileError) {
    //     console.error('[Turnstile] Verification error:', turnstileError);
    //     return NextResponse.json({
    //       error: 'Security verification error. Please try again.'
    //     }, { status: 500 });
    //   }
    // } else {
    //   console.warn('[Turnstile] TURNSTILE_SECRET_KEY not configured - skipping verification (development mode)');
    // }
    console.log('[Turnstile] Validation disabled - skipping verification');

    // Validate and sanitize URL
    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      console.error('URL validation failed:', urlValidation.error);
      return NextResponse.json({ error: urlValidation.error || 'Invalid URL' }, { status: 400 });
    }

    const sanitizedUrl = urlValidation.sanitized!;

    // Check required environment variables
    if (!process.env.OPENROUTER_API) {
      console.error('OPENROUTER_API not configured');
      return NextResponse.json({ error: 'API configuration error. OPENROUTER_API not found.' }, { status: 500 });
    }

    console.log('Scraping URL:', sanitizedUrl);

    let content = '';
    let scraperUsed = 'unknown';

    // Try Firecrawl first (if API key is available)
    if (process.env.FIRECRAWL_API_KEY) {
      console.log('Attempting to scrape with Firecrawl...');
      try {
        const firecrawl = getFirecrawlClient();

        // Try different API call formats for compatibility
        let scrapeResult: unknown;
        try {
          // V4 API format with optimized settings
          scrapeResult = await (firecrawl as unknown as { scrape: (params: { url: string; formats: string[]; onlyMainContent: boolean; waitFor: number; timeout?: number }) => Promise<unknown> }).scrape({
            url: sanitizedUrl,
            formats: ['markdown'],
            onlyMainContent: true,
            waitFor: 2000,
            timeout: 30000, // 30 second timeout
          });
        } catch {
          console.log('V4 format failed, trying V3 format');

          // Fallback to V3 API format
          scrapeResult = await (firecrawl as unknown as { scrape: (url: string, params: { formats: string[]; onlyMainContent: boolean }) => Promise<unknown> }).scrape(sanitizedUrl, {
            formats: ['markdown'],
            onlyMainContent: true,
          });
        }

        console.log('Firecrawl response received');

        // Handle different response formats
        if (scrapeResult) {
          const response = scrapeResult as Record<string, unknown>;

          // V4 format check
          if (response.data && typeof response.data === 'object') {
            const data = response.data as Record<string, unknown>;
            if (typeof data.markdown === 'string') {
              content = data.markdown;
            }
          }
          // V3 format check
          else if (response.success && response.data && typeof response.data === 'object') {
            const data = response.data as Record<string, unknown>;
            content = (typeof data.markdown === 'string' ? data.markdown : '') ||
                      (typeof data.content === 'string' ? data.content : '') || '';
          }
          // Direct response format
          else if (typeof response.markdown === 'string') {
            content = response.markdown;
          }
        }

        if (content && content.length >= 100) {
          scraperUsed = 'firecrawl';
          console.log('Content extracted successfully with Firecrawl, length:', content.length);
        } else {
          throw new Error('Firecrawl returned insufficient content');
        }

      } catch (firecrawlError) {
        console.error('Firecrawl failed:', firecrawlError);
        content = ''; // Reset content to trigger Crawlee fallback
      }
    } else {
      console.log('FIRECRAWL_API_KEY not found, will use Crawlee PlaywrightCrawler directly');
    }

    // Fallback to Crawlee if Firecrawl failed or API key not available
    if (!content || content.length < 100) {
      console.log('Falling back to Crawlee PlaywrightCrawler...');
      try {
        content = await scrapeWithCrawlee(sanitizedUrl);
        scraperUsed = 'crawlee';

        if (!content || content.length < 100) {
          throw new Error('Crawlee returned insufficient content');
        }

        console.log('Content extracted successfully with Crawlee, length:', content.length);

      } catch (crawleeError) {
        console.error('Crawlee fallback failed:', crawleeError);

        // Final fallback: simple fetch
        console.log('Falling back to simple fetch...');
        try {
          content = await scrapeWithFetch(sanitizedUrl);
          scraperUsed = 'fetch';

          if (!content || content.length < 100) {
            return NextResponse.json({
              error: 'Could not extract sufficient content from the URL. The page may be protected or use JavaScript rendering. Please try a different URL.'
            }, { status: 400 });
          }

          console.log('Content extracted successfully with fetch, length:', content.length);
        } catch (fetchError) {
          console.error('All scraping methods failed:', fetchError);

          return NextResponse.json({
            error: 'Failed to extract content from the URL. Please verify the URL is accessible and try again.'
          }, { status: 400 });
        }
      }
    }
    
    // Check if content looks like a privacy policy
    const privacyKeywords = ['privacy', 'personal information', 'data collection', 'cookies', 'third party'];
    const hasPrivacyContent = privacyKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!hasPrivacyContent) {
      return NextResponse.json({ 
        error: 'The extracted content does not appear to be a privacy policy. Please provide a direct link to a privacy policy page.' 
      }, { status: 400 });
    }

    // Firebase/Firestore caching disabled for MVP
    // const domain = extractDomain(sanitizedUrl);
    // const contentHash = generateContentHash(content);
    //
    // console.log('Domain extracted:', domain);
    // console.log('Content hash generated:', contentHash);
    //
    // // Check if we have a recent analysis
    // const existingCheck = await checkExistingAnalysis(domain, contentHash);
    //
    // if (existingCheck.exists && !existingCheck.needsUpdate) {
    //   console.log('Returning cached analysis (no changes detected, within 30 days)');
    //   await updateLastChecked(domain);
    //
    //   return NextResponse.json({
    //     url: sanitizedUrl,
    //     domain,
    //     cached: true,
    //     timestamp: new Date().toISOString(),
    //     analysis: existingCheck.data,
    //     message: 'Using cached analysis - no changes detected'
    //   });
    // }
    //
    // if (existingCheck.exists && existingCheck.needsUpdate) {
    //   console.log('Content has changed or expired, re-analyzing...');
    // }

    console.log('Analyzing privacy policy with AI...');

    // Analyze with OpenRouter AI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content: PRIVACY_ANALYSIS_PROMPT
        },
        {
          role: "user",
          content: `Analyze this privacy policy:\n\n${content.substring(0, 16000)}` // Limit content size
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const analysisText = completion.choices[0]?.message?.content;

    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    // Parse JSON response
    let analysis;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : analysisText;
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse analysis results');
    }

    // Database saving disabled for MVP - no storage, just analyze and return
    // try {
    //   const analysisId = saveSQLiteAnalysis(sanitizedUrl, analysis);
    //   console.log('Analysis saved to SQLite database with ID:', analysisId);
    // } catch (dbError) {
    //   console.error('Failed to save analysis to SQLite database:', dbError);
    //   // Don't fail the request if database save fails
    // }
    //
    // // Save analysis to Firestore
    // try {
    //   const urlObj = new URL(sanitizedUrl);
    //   const hostname = urlObj.hostname.replace(/^www\./, '');
    //   const logoUrl = getOptimizedLogo(hostname, 128);
    //
    //   await saveFirestoreAnalysis(domain, {
    //     url: sanitizedUrl,
    //     hostname,
    //     logo_url: logoUrl,
    //     overall_score: analysis.overall_score,
    //     privacy_grade: analysis.privacy_grade,
    //     risk_level: analysis.risk_level,
    //     gdpr_compliance: analysis.regulatory_compliance?.gdpr_compliance || 'UNKNOWN',
    //     ccpa_compliance: analysis.regulatory_compliance?.ccpa_compliance || 'UNKNOWN',
    //     dpdp_act_compliance: analysis.regulatory_compliance?.dpdp_act_compliance,
    //     analysis_data: {
    //       overall_score: analysis.overall_score,
    //       privacy_grade: analysis.privacy_grade,
    //       risk_level: analysis.risk_level,
    //       regulatory_compliance: analysis.regulatory_compliance,
    //       categories: analysis.categories,
    //       recommendations: analysis.actionable_recommendations?.immediate_actions || [],
    //       key_findings: analysis.critical_findings?.high_risk_practices || [],
    //       summary: analysis.executive_summary
    //     },
    //     content_hash: contentHash
    //   });
    //   console.log('Analysis saved to Firestore for domain:', domain);
    // } catch (firestoreError) {
    //   console.error('Failed to save to Firestore:', firestoreError);
    //   // Don't fail the request if Firestore save fails
    // }

    // Add metadata
    const result = {
      url: sanitizedUrl,
      timestamp: new Date().toISOString(),
      content_length: content.length,
      scraper_used: scraperUsed,
      analysis,
      raw_content: content.substring(0, 2000) // First 2000 chars for reference
    };

    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error('Analysis error:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Specific error handling
    if (errorMessage?.includes('rate limit') || errorMessage?.includes('429')) {
      return NextResponse.json({
        error: 'Rate limit exceeded. Please try again in a moment.'
      }, { status: 429 });
    }

    if (errorMessage?.includes('API key') || errorMessage?.includes('401') || errorMessage?.includes('403')) {
      return NextResponse.json({
        error: 'API configuration error. Please contact support.'
      }, { status: 500 });
    }

    if (errorMessage?.includes('timeout') || errorMessage?.includes('ETIMEDOUT')) {
      return NextResponse.json({
        error: 'Request timed out. The website may be slow or unresponsive. Please try again.'
      }, { status: 504 });
    }

    if (errorMessage?.includes('ENOTFOUND') || errorMessage?.includes('ECONNREFUSED')) {
      return NextResponse.json({
        error: 'Could not connect to the website. Please check the URL and try again.'
      }, { status: 400 });
    }

    if (errorMessage?.includes('AbortError')) {
      return NextResponse.json({
        error: 'Request was cancelled due to timeout. Please try again.'
      }, { status: 408 });
    }

    // Log the full error for debugging
    console.error('Unhandled error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });

    return NextResponse.json({
      error: 'Analysis failed. Please try again or contact support if the issue persists.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}