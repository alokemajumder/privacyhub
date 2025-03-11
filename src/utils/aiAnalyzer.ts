import axios from 'axios';
import { PrivacyScore } from '../types';

// Initialize OpenRouter client configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'privacyhub.in';
const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'PrivacyHub';

// Function to validate API key
const validateApiKey = (apiKey: string | undefined): boolean => {
  if (!apiKey) return false;
  // Basic validation for OpenRouter API key format
  return apiKey.startsWith('sk-or-v1-') && apiKey.length > 40;
};

// Function to get visitor's browser details
const getVisitorBrowserDetails = (): {
  userAgent: string;
  ipAddress: string;
} => {
  return {
    userAgent: navigator.userAgent || '',
    ipAddress: '' // This will be populated by the server if available
  };
};

// Define the criteria for evaluation
const evaluationCriteria = [
  {
    category: "Handling",
    criteria: "Personally-targeted or behavioural marketing",
    maxScore: 10,
    description: "Evaluates how the privacy policy handles targeted advertising and behavioral marketing."
  },
  {
    category: "Handling",
    criteria: "Permanent deletion of personal data",
    maxScore: 5,
    description: "Assesses whether users can permanently delete their personal data and how straightforward the process is."
  },
  {
    category: "Handling",
    criteria: "Third-party access to private personal data",
    maxScore: 10,
    description: "Evaluates how the policy handles sharing personal data with third parties and what controls users have."
  },
  {
    category: "Handling",
    criteria: "Law enforcement access to personal data",
    maxScore: 5,
    description: "Assesses how the policy addresses sharing data with law enforcement and government agencies."
  },
  {
    category: "Transparency",
    criteria: "General security practices outlined",
    maxScore: 3,
    description: "Evaluates whether the policy outlines security measures used to protect user data."
  },
  {
    category: "Transparency",
    criteria: "Policy's history availability",
    maxScore: 5,
    description: "Assesses whether previous versions of the privacy policy are accessible to users."
  },
  {
    category: "Transparency",
    criteria: "Notification requirement in case of a data breach",
    maxScore: 7,
    description: "Evaluates whether the policy commits to notifying users in case of a data breach."
  },
  {
    category: "Transparency",
    criteria: "Notification to users when policy is meaningfully changed",
    maxScore: 5,
    description: "Assesses whether users are notified when the privacy policy changes significantly."
  },
  {
    category: "Collection",
    criteria: "Collection of personal data from third parties",
    maxScore: 10,
    description: "Evaluates whether the policy discloses collection of user data from third parties."
  },
  {
    category: "Collection",
    criteria: "Clarity on why personal data is collected",
    maxScore: 10,
    description: "Assesses whether the policy clearly explains why personal data is collected."
  },
  {
    category: "Collection",
    criteria: "Control over non-critical personal data collection or use",
    maxScore: 10,
    description: "Evaluates whether users have control over what non-essential data is collected or how it's used."
  },
  {
    category: "Collection",
    criteria: "Listing of personal data collected",
    maxScore: 10,
    description: "Assesses whether the policy clearly lists what personal data is collected."
  }
];

// Create the analysis prompt for the AI
const createAnalysisPrompt = (content: string): string => {
  return `
Analyze the following privacy policy and evaluate it based on the criteria below. 
For each criterion, provide a score and a brief explanation of your reasoning.
If appropriate, include specific recommendations for improvement.

Privacy Policy Content:
${content.substring(0, 15000)}... 

Evaluation Criteria:
${evaluationCriteria.map(c => `${c.category} - ${c.criteria} (Score out of ${c.maxScore}): ${c.description}`).join('\n')}

Provide your response in the following JSON format:
{
  "scores": [
    {
      "category": "Category name",
      "criteria": "Criteria name",
      "score": number,
      "maxScore": number,
      "description": "Description of the criteria",
      "recommendations": "Recommendations for improvement (if any)"
    },
    ...
  ],
  "summary": "A concise 3-5 sentence summary of the overall privacy policy, highlighting strengths and weaknesses"
}
`;
};

// Function to analyze privacy policy content using Gemini via OpenRouter
export const analyzePrivacyPolicyWithAI = async (content: string): Promise<{
  scores: PrivacyScore[];
  summary: string;
}> => {
  try {
    // Validate API key before making request
    if (!validateApiKey(OPENROUTER_API_KEY)) {
      console.log('Invalid or missing API key - using rule-based analysis');
      return generateDemoAnalysis(content);
    }
    
    // Prepare the prompt for the AI
    const prompt = createAnalysisPrompt(content);
    
    // Get visitor's browser user agent and IP
    const visitorDetails = getVisitorBrowserDetails();
    
    // Call the OpenRouter API with Gemini Flash
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-flash-1.5",
        messages: [
          {
            role: "system",
            content: "You are a privacy policy expert specializing in analyzing privacy policies for clarity, user protection, and compliance with best practices. Your task is to evaluate a privacy policy based on specific criteria and provide scores and recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json",
          "User-Agent": visitorDetails.userAgent,
          "X-Forwarded-For": visitorDetails.ipAddress || undefined,
          "X-Real-IP": visitorDetails.ipAddress || undefined
        },
        timeout: 45000
      }
    );
    
    // Parse the AI response
    const aiResponse = JSON.parse(response.data.choices[0].message.content || "{}");
    
    // Process the scores
    const scores = processAIScores(aiResponse.scores);
    
    return {
      scores,
      summary: aiResponse.summary || generateFallbackSummary(scores)
    };
  } catch (error) {
    console.error("Error analyzing privacy policy with Gemini:", error);
    return generateDemoAnalysis(content);
  }
};

// Process AI scores to ensure they match our expected format
const processAIScores = (aiScores: any[]): PrivacyScore[] => {
  if (!aiScores || !Array.isArray(aiScores)) {
    console.error("Invalid AI scores format, using fallback");
    return generateFallbackScores();
  }
  
  // Map AI scores to our format and validate
  return aiScores.map(score => {
    const criterion = evaluationCriteria.find(c => 
      c.criteria.toLowerCase() === score.criteria.toLowerCase() ||
      c.criteria.includes(score.criteria) ||
      score.criteria.includes(c.criteria)
    );
    
    if (!criterion) {
      console.warn(`Unknown criterion: ${score.criteria}`);
      return null;
    }
    
    return {
      category: score.category || criterion.category,
      criteria: criterion.criteria,
      score: Math.min(Math.max(0, score.score), criterion.maxScore),
      maxScore: criterion.maxScore,
      description: criterion.description,
      recommendations: score.recommendations || ""
    };
  }).filter(Boolean) as PrivacyScore[];
};

// Generate a fallback summary based on scores
const generateFallbackSummary = (scores: PrivacyScore[]): string => {
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  const maxTotalScore = scores.reduce((sum, score) => sum + score.maxScore, 0);
  const percentage = Math.round((totalScore / maxTotalScore) * 100);
  
  let summary = "This privacy policy ";
  
  if (percentage >= 80) {
    summary += "provides excellent protection for user data with strong transparency and user controls. ";
  } else if (percentage >= 60) {
    summary += "provides good protection for user data with reasonable transparency in several areas. ";
  } else if (percentage >= 40) {
    summary += "provides moderate protection for user data but has significant room for improvement. ";
  } else {
    summary += "has serious deficiencies in protecting user data and lacks transparency in critical areas. ";
  }
  
  // Add strengths
  const strengths = scores
    .filter(s => s.score >= s.maxScore * 0.8)
    .map(s => s.criteria)
    .slice(0, 3);
    
  if (strengths.length > 0) {
    summary += `Strengths include ${strengths.join(', ')}. `;
  }
  
  // Add weaknesses
  const weaknesses = scores
    .filter(s => s.score <= s.maxScore * 0.3)
    .map(s => s.criteria)
    .slice(0, 3);
    
  if (weaknesses.length > 0) {
    summary += `Areas for improvement include ${weaknesses.join(', ')}.`;
  }
  
  return summary;
};

// Generate fallback scores when AI analysis fails
const generateFallbackScores = (): PrivacyScore[] => {
  return evaluationCriteria.map(criterion => ({
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.floor(criterion.maxScore * 0.6),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: "This is a default score. For a more accurate assessment, please try again later."
  }));
};

// Rule-based scoring functions for demo mode
const scorePersonalMarketing = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Personally-targeted or behavioural marketing")!;
  const keywords = ['targeted advertising', 'personalized ads', 'behavioral marketing', 'interest-based ads'];
  const optOutKeywords = ['opt out', 'opt-out', 'disable', 'preferences', 'settings', 'control'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy mentions targeted advertising
  if (keywords.some(k => content.includes(k))) {
    score += 3;
    
    // Check if policy mentions opt-out options
    if (optOutKeywords.some(k => content.includes(k))) {
      score += 3;
      
      // Check for detailed opt-out instructions
      if (content.includes('how to') && optOutKeywords.some(k => content.includes(k))) {
        score += 2;
      } else {
        recommendation = "Could provide more detailed instructions for opting out of targeted advertising.";
      }
    } else {
      recommendation = "Should provide clear options for opting out of targeted advertising.";
    }
    
    // Check for granular controls
    if (content.includes('control') && content.includes('preferences')) {
      score += 2;
    } else {
      if (!recommendation) {
        recommendation = "Could provide more granular controls for different types of targeted advertising.";
      }
    }
  } else {
    // If no mention of targeted advertising
    if (content.includes('advertising') || content.includes('marketing')) {
      score = 5;
      recommendation = "Should clarify whether personally-targeted advertising is used and provide opt-out options.";
    } else {
      score = 10; // Assume no targeted advertising is used if not mentioned
    }
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scoreDataDeletion = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Permanent deletion of personal data")!;
  const deletionKeywords = ['delete', 'deletion', 'remove', 'erase', 'erasure'];
  const processKeywords = ['request', 'how to', 'process', 'procedure'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy mentions data deletion
  if (deletionKeywords.some(k => content.includes(k))) {
    score += 2;
    
    // Check if policy explains the deletion process
    if (processKeywords.some(k => content.includes(k))) {
      score += 2;
    } else {
      recommendation = "Should provide clearer information about the data deletion process.";
    }
    
    // Check if policy mentions retention period
    if (content.includes('retention') || content.includes('retain')) {
      score += 1;
    } else {
      if (!recommendation) {
        recommendation = "Should specify data retention periods.";
      }
    }
  } else {
    recommendation = "Should provide information about how users can permanently delete their personal data.";
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scoreThirdPartyAccess = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Third-party access to private personal data")!;
  const sharingKeywords = ['share', 'sharing', 'third party', 'third parties', 'partners', 'service providers'];
  const controlKeywords = ['control', 'opt out', 'opt-out', 'consent', 'permission'];
  const specificKeywords = ['list', 'specific', 'categories', 'types of third parties'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy mentions third-party sharing
  if (sharingKeywords.some(k => content.includes(k))) {
    score += 3;
    
    // Check if policy mentions user controls over sharing
    if (controlKeywords.some(k => content.includes(k))) {
      score += 3;
    } else {
      recommendation = "Should provide user controls over third-party data sharing.";
    }
    
    // Check if policy specifies which third parties
    if (specificKeywords.some(k => content.includes(k))) {
      score += 4;
    } else {
      if (!recommendation) {
        recommendation = "Should provide more specific information about which third parties receive user data.";
      }
    }
  } else {
    // If no mention of third-party sharing
    if (content.includes('third') || content.includes('partner') || content.includes('provider')) {
      score = 5;
      recommendation = "Should clarify what user data is shared with third parties and what controls users have.";
    } else {
      score = 10; // Assume no third-party sharing if not mentioned
    }
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scoreLawEnforcement = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Law enforcement access to personal data")!;
  const lawKeywords = ['law enforcement', 'government', 'legal', 'court', 'subpoena', 'warrant'];
  const transparencyKeywords = ['transparency report', 'report', 'notify', 'notification'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy mentions law enforcement access
  if (lawKeywords.some(k => content.includes(k))) {
    score += 3;
    
    // Check if policy mentions transparency reporting
    if (transparencyKeywords.some(k => content.includes(k))) {
      score += 2;
    } else {
      recommendation = "Could provide more transparency about government data requests.";
    }
  } else {
    recommendation = "Should address how the company handles law enforcement requests for user data.";
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scoreSecurityPractices = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "General security practices outlined")!;
  const securityKeywords = ['security', 'protect', 'safeguard', 'encryption', 'secure'];
  const specificKeywords = ['encryption', 'SSL', 'TLS', 'firewall', 'authentication'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy mentions security practices
  if (securityKeywords.some(k => content.includes(k))) {
    score += 2;
    
    // Check if policy mentions specific security measures
    if (specificKeywords.some(k => content.includes(k))) {
      score += 1;
    } else {
      recommendation = "Could provide more specific details about security measures implemented.";
    }
  } else {
    recommendation = "Should outline security practices used to protect user data.";
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scorePolicyHistory = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Policy's history availability")!;
  const historyKeywords = ['previous version', 'history', 'archive', 'past version', 'changes'];
  const accessKeywords = ['available', 'access', 'view', 'request'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy mentions version history
  if (historyKeywords.some(k => content.includes(k))) {
    score += 3;
    
    // Check if policy mentions how to access previous versions
    if (accessKeywords.some(k => content.includes(k))) {
      score += 2;
    } else {
      recommendation = "Should make previous policy versions more easily accessible.";
    }
  } else {
    recommendation = "Should make previous versions of the privacy policy accessible to users.";
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scoreDataBreach = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Notification requirement in case of a data breach")!;
  const breachKeywords = ['breach', 'incident', 'unauthorized access', 'compromise'];
  const notificationKeywords = ['notify', 'notification', 'inform', 'alert'];
  const timelineKeywords = ['timeline', 'promptly', 'immediately', 'within', 'days'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy mentions data breaches
  if (breachKeywords.some(k => content.includes(k))) {
    score += 2;
    
    // Check if policy mentions notification
    if (notificationKeywords.some(k => content.includes(k))) {
      score += 3;
      
      // Check if policy specifies notification timeline
      if (timelineKeywords.some(k => content.includes(k))) {
        score += 2;
      } else {
        recommendation = "Should specify a timeline for notification after discovery of a breach.";
      }
    } else {
      recommendation = "Should explicitly commit to notifying users in case of a data breach.";
    }
  } else {
    recommendation = "Should address data breach notification procedures.";
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scorePolicyChange = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Notification to users when policy is meaningfully changed")!;
  const changeKeywords = ['change', 'update', 'modify', 'revise'];
  const notificationKeywords = ['notify', 'notification', 'inform', 'alert', 'email'];
  const significantKeywords = ['significant', 'material', 'important', 'substantial'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy mentions policy changes
  if (changeKeywords.some(k => content.includes(k))) {
    score += 2;
    
    // Check if policy mentions notification of changes
    if (notificationKeywords.some(k => content.includes(k))) {
      score += 2;
      
      // Check if policy distinguishes significant changes
      if (significantKeywords.some(k => content.includes(k))) {
        score += 1;
      } else {
        recommendation = "Could better define what constitutes a significant change requiring notification.";
      }
    } else {
      recommendation = "Should commit to notifying users when the privacy policy changes significantly.";
    }
  } else {
    recommendation = "Should address how users are notified about privacy policy changes.";
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scoreThirdPartyCollection = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Collection of personal data from third parties")!;
  const collectionKeywords = ['collect', 'receive', 'obtain', 'acquire'];
  const thirdPartyKeywords = ['third party', 'third parties', 'partners', 'sources'];
  const specificKeywords = ['specific', 'list', 'categories', 'types of data'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy mentions third-party data collection
  if (collectionKeywords.some(k => content.includes(k)) && thirdPartyKeywords.some(k => content.includes(k))) {
    score += 4;
    
    // Check if policy specifies what data is collected from third parties
    if (specificKeywords.some(k => content.includes(k))) {
      score += 3;
    } else {
      recommendation = "Should provide more details about what specific data is collected from third parties.";
    }
    
    // Check if policy names specific third parties
    if (content.includes('name') || content.includes('specific third part')) {
      score += 3;
    } else {
      if (!recommendation) {
        recommendation = "Should identify specific third parties that provide data.";
      }
    }
  } else {
    // If no mention of third-party collection
    if (thirdPartyKeywords.some(k => content.includes(k))) {
      score = 5;
      recommendation = "Should clarify whether personal data is collected from third parties.";
    } else {
      score = 10; // Assume no third-party collection if not mentioned
    }
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scoreDataCollectionReason = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Clarity on why personal data is collected")!;
  const reasonKeywords = ['why', 'purpose', 'reason', 'use', 'uses'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy explains why data is collected
  if (reasonKeywords.some(k => content.includes(k))) {
    score += 5;
    
    // Check if policy explains purposes for specific data types
    if (content.includes('data') && reasonKeywords.some(k => content.includes(k + ' we collect'))) {
      score += 3;
    } else {
      recommendation = "Could provide more specific explanations for why certain data types are collected.";
    }
    
    // Check for unnecessary data collection
    if (content.includes('necessary') || content.includes('required')) {
      score += 2;
    } else {
      if (!recommendation) {
        recommendation = "Should clarify which data collection is necessary vs. optional.";
      }
    }
  } else {
    recommendation = "Should clearly explain why personal data is collected.";
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scoreNonCriticalControl = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Control over non-critical personal data collection or use")!;
  const controlKeywords = ['control', 'opt out', 'opt-out', 'preferences', 'settings', 'choices'];
  const nonCriticalKeywords = ['optional', 'non-essential', 'non-critical', 'preferences', 'personalization'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy mentions user controls
  if (controlKeywords.some(k => content.includes(k))) {
    score += 5;
    
    // Check if policy distinguishes critical vs. non-critical data
    if (nonCriticalKeywords.some(k => content.includes(k))) {
      score += 3;
    } else {
      recommendation = "Should distinguish between essential and non-essential data collection.";
    }
    
    // Check for granular controls
    if (content.includes('granular') || content.includes('specific') || content.includes('individual')) {
      score += 2;
    } else {
      if (!recommendation) {
        recommendation = "Could provide more granular controls for specific types of non-essential data.";
      }
    }
  } else {
    recommendation = "Should provide user controls over non-essential data collection.";
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

const scoreDataCollectionListing = (content: string): PrivacyScore => {
  const criterion = evaluationCriteria.find(c => c.criteria === "Listing of personal data collected")!;
  const listingKeywords = ['collect', 'information we collect', 'data we collect', 'personal data'];
  const dataTypeKeywords = ['name', 'email', 'address', 'phone', 'location', 'IP address', 'device'];
  
  let score = 0;
  let recommendation = "";
  
  // Check if policy lists collected data
  if (listingKeywords.some(k => content.includes(k))) {
    score += 5;
    
    // Check for specific data types
    const dataTypesFound = dataTypeKeywords.filter(k => content.includes(k)).length;
    score += Math.min(3, dataTypesFound);
    
    // Check for organization by sensitivity or purpose
    if (content.includes('sensitive') || content.includes('category') || content.includes('categories')) {
      score += 2;
    } else {
      recommendation = "Could organize data collection by sensitivity level or purpose.";
    }
  } else {
    recommendation = "Should clearly list what personal data is collected.";
  }
  
  return {
    category: criterion.category,
    criteria: criterion.criteria,
    score: Math.min(score, criterion.maxScore),
    maxScore: criterion.maxScore,
    description: criterion.description,
    recommendations: recommendation
  };
};

// Generate a demo analysis when API key is not available
const generateDemoAnalysis = (content: string): {
  scores: PrivacyScore[];
  summary: string;
} => {
  // Use the rule-based analysis for demo purposes
  const lowerContent = content.toLowerCase();
  const scores: PrivacyScore[] = [];
  
  // Handling category
  scores.push(scorePersonalMarketing(lowerContent));
  scores.push(scoreDataDeletion(lowerContent));
  scores.push(scoreThirdPartyAccess(lowerContent));
  scores.push(scoreLawEnforcement(lowerContent));
  
  // Transparency category
  scores.push(scoreSecurityPractices(lowerContent));
  scores.push(scorePolicyHistory(lowerContent));
  scores.push(scoreDataBreach(lowerContent));
  scores.push(scorePolicyChange(lowerContent));
  
  // Collection category
  scores.push(scoreThirdPartyCollection(lowerContent));
  scores.push(scoreDataCollectionReason(lowerContent));
  scores.push(scoreNonCriticalControl(lowerContent));
  scores.push(scoreDataCollectionListing(lowerContent));
  
  // Generate summary
  const summary = generateFallbackSummary(scores);
  
  return {
    scores,
    summary
  };
};