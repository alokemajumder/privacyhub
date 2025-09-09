import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Initialize OpenAI client inside the route handler to avoid build-time issues
function getOpenAIClient() {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
}

// Simple web scraper function
async function scrapeWebpage(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove script and style elements
    $('script, style, nav, header, footer, .navigation, #navigation').remove();
    
    // Extract text content
    const text = $('body').text()
      .replace(/\s+/g, ' ')
      .trim();
    
    return text;
  } catch (_error) {
    throw new Error('Failed to fetch webpage content');
  }
}

const PRIVACY_ANALYSIS_PROMPT = `
You are a privacy policy expert. Analyze the following privacy policy and provide a comprehensive assessment.

Rate each category from 1-10 (10 being best for user privacy):

**Data Collection (Weight: 25%)**
- What personal data is collected?
- Is data collection minimized?
- Is purpose clearly stated?

**Data Usage (Weight: 20%)**
- How is data used?
- Is usage limited to stated purposes?
- Are there restrictions on secondary use?

**Data Sharing (Weight: 25%)**
- Is data shared with third parties?
- What are the sharing purposes?
- Is user consent required?

**User Rights (Weight: 15%)**
- Can users access their data?
- Can users delete their data?
- Can users correct their data?
- Can users opt-out?

**Security Measures (Weight: 10%)**
- What security measures are mentioned?
- How is data protected?
- Are breaches disclosed?

**Transparency (Weight: 5%)**
- Is the policy clear and understandable?
- Are changes communicated?
- Is contact information provided?

Provide your response in this JSON format:
{
  "overall_score": number (1-10),
  "categories": {
    "data_collection": {"score": number, "reasoning": "string"},
    "data_usage": {"score": number, "reasoning": "string"},
    "data_sharing": {"score": number, "reasoning": "string"},
    "user_rights": {"score": number, "reasoning": "string"},
    "security_measures": {"score": number, "reasoning": "string"},
    "transparency": {"score": number, "reasoning": "string"}
  },
  "key_concerns": ["string", "string", "string"],
  "positive_aspects": ["string", "string", "string"],
  "recommendations": ["string", "string", "string"],
  "privacy_grade": "string (A+ to F)",
  "summary": "string (2-3 sentences)"
}
`;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    console.log('Scraping URL:', url);

    // Scrape webpage content
    const content = await scrapeWebpage(url);

    if (!content || content.length < 100) {
      return NextResponse.json({ 
        error: 'Failed to extract content from URL. Please check if the URL is accessible and contains a privacy policy.' 
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
      model: "anthropic/claude-3.5-sonnet",
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