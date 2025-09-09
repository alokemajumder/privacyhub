import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import FirecrawlApp from '@mendable/firecrawl-js';

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

const PRIVACY_ANALYSIS_PROMPT = `
You are a certified privacy policy expert with expertise in GDPR, CCPA, PIPEDA, and international data protection frameworks. Conduct a comprehensive privacy impact assessment using evidence-based evaluation criteria.

SCORING METHODOLOGY: Rate each category 1-10 (10 = exemplary privacy protection, 1 = significant privacy risk)

**DATA MINIMIZATION & COLLECTION PRACTICES (Weight: 30%)**
Evaluate against GDPR Art. 5(1)(c) and privacy-by-design principles:
- Collection scope: Only necessary data for stated purposes (10), excessive collection without justification (1-3)
- Legal basis clarity: Explicit lawful basis identification (Art. 6 GDPR) 
- Purpose specification: Clear, specific purposes vs. vague "business operations"
- Sensitive data handling: Special category data protections (Art. 9 GDPR)
- Children's data: COPPA/GDPR-K compliance for under-16 users

**THIRD-PARTY DATA SHARING & TRANSFERS (Weight: 25%)**
Assess data controller/processor relationships and transfer mechanisms:
- Sharing scope: No sharing (10), limited with consent (7-8), extensive commercial sharing (1-4)
- International transfers: Adequate country/SCCs/BCRs compliance (GDPR Ch. V)
- Processor agreements: Evidence of Art. 28 GDPR-compliant contracts
- Consent mechanisms: Granular, withdrawable consent vs. bundled/forced consent
- Commercial exploitation: Data monetization practices and user awareness

**INDIVIDUAL RIGHTS & DATA SUBJECT CONTROLS (Weight: 20%)**
Evaluate GDPR Chapter III rights implementation:
- Access rights (Art. 15): Comprehensive data access mechanisms
- Rectification (Art. 16): Error correction processes
- Erasure (Art. 17): Right to be forgotten implementation
- Portability (Art. 20): Structured data export capabilities
- Objection (Art. 21): Opt-out mechanisms for processing
- Response timeframes: Compliance with 30-day regulatory requirements

**SECURITY & RISK MANAGEMENT (Weight: 15%)**
Technical and organizational measures assessment (GDPR Art. 32):
- Encryption standards: End-to-end, in-transit, at-rest protections
- Access controls: Role-based access, multi-factor authentication
- Incident response: Breach notification procedures (72-hour GDPR requirement)
- Risk assessment: Regular privacy impact assessments
- Data retention: Defined, justified retention periods with deletion schedules

**REGULATORY COMPLIANCE & LEGAL FRAMEWORK (Weight: 7%)**
Multi-jurisdictional compliance evaluation:
- GDPR compliance indicators (EU users)
- CCPA compliance markers (California residents) 
- Sectoral compliance (HIPAA, FERPA, GLBA where applicable)
- Privacy officer designation and contact information
- Legal basis documentation and DPO appointment evidence

**TRANSPARENCY & COMMUNICATION (Weight: 3%)**
Information quality and accessibility assessment:
- Language clarity: Plain language vs. legal jargon (Flesch-Kincaid readability)
- Policy accessibility: Layered notices, mobile optimization
- Change notification: Proactive user notification mechanisms
- Contact mechanisms: Dedicated privacy contact/DPO information

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
    
    const { url } = await request.json();

    if (!url) {
      console.error('No URL provided in request');
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      console.error('Invalid URL format:', url);
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Check environment variables
    if (!process.env.FIRECRAWL_API_KEY) {
      console.error('FIRECRAWL_API_KEY not configured');
      return NextResponse.json({ error: 'API configuration error. FIRECRAWL_API_KEY not found.' }, { status: 500 });
    }

    if (!process.env.OPENROUTER_API) {
      console.error('OPENROUTER_API not configured');
      return NextResponse.json({ error: 'API configuration error. OPENROUTER_API not found.' }, { status: 500 });
    }

    console.log('Scraping URL with Firecrawl:', url);

    // Use Firecrawl to extract content
    const firecrawl = getFirecrawlClient();
    let content = '';
    
    try {
      // Try different API call formats for compatibility
      let scrapeResponse: unknown;
      try {
        // V4 API format
        scrapeResponse = await (firecrawl as unknown as { scrape: (params: { url: string; formats: string[]; onlyMainContent: boolean; waitFor: number }) => Promise<unknown> }).scrape({
          url: url,
          formats: ['markdown'],
          onlyMainContent: true,
          waitFor: 2000,
        });
      } catch (_v4Error) {
        console.log('V4 format failed, trying V3 format');
        // Fallback to V3 API format
        scrapeResponse = await (firecrawl as unknown as { scrape: (url: string, params: { formats: string[]; onlyMainContent: boolean }) => Promise<unknown> }).scrape(url, {
          formats: ['markdown'],
          onlyMainContent: true,
        });
      }

      console.log('Firecrawl response:', scrapeResponse);

      // Handle different response formats
      if (!scrapeResponse) {
        throw new Error('No response from Firecrawl');
      }

      // Handle different response formats with type checking
      const response = scrapeResponse as Record<string, unknown>;
      
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
      else {
        console.error('Unexpected Firecrawl response format:', scrapeResponse);
        throw new Error('Unexpected response format from Firecrawl');
      }

      if (!content || content.length < 100) {
        return NextResponse.json({ 
          error: 'Extracted content is too short or empty. Please provide a direct link to a privacy policy page.' 
        }, { status: 400 });
      }

      console.log('Content extracted successfully, length:', content.length);
      
    } catch (firecrawlError) {
      console.error('Firecrawl API error:', firecrawlError);
      return NextResponse.json({ 
        error: 'Failed to extract content using Firecrawl. Please verify the URL is accessible and try again.' 
      }, { status: 400 });
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

    // Add metadata
    const result = {
      url,
      timestamp: new Date().toISOString(),
      content_length: content.length,
      analysis,
      raw_content: content.substring(0, 2000) // First 2000 chars for reference
    };

    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error('Analysis error:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage?.includes('rate limit')) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded. Please try again in a moment.' 
      }, { status: 429 });
    }
    
    if (errorMessage?.includes('API key')) {
      return NextResponse.json({ 
        error: 'API configuration error. Please contact support.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: 'Analysis failed. Please try again or contact support if the issue persists.' 
    }, { status: 500 });
  }
}