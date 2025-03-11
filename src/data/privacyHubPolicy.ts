import { PrivacyAnalysis } from '../types';

export const privacyHubAnalysis: PrivacyAnalysis = {
  siteName: "PrivacyHub",
  siteUrl: "https://privacyhub.in/privacy",
  logoUrl: "https://www.google.com/s2/favicons?domain=privacyhub.in&sz=128",
  screenshotUrl: "https://image.thum.io/get/width/600/crop/400/viewportWidth/1200/png/noanimate/https://privacyhub.in",
  summary: "PrivacyHub's privacy policy demonstrates strong commitment to user privacy with minimal data collection. The policy is transparent about the limited data collected (only IP addresses and browser information via Google Analytics), clear data usage purposes, and no sharing of personal data with third parties. All analysis data is stored locally on the user's device, not on PrivacyHub's servers, giving users complete control over their data.",
  scores: [
    // Handling category
    {
      category: "Handling",
      criteria: "Personally-targeted or behavioural marketing",
      score: 10,
      maxScore: 10,
      description: "Evaluates how the privacy policy handles targeted advertising and behavioral marketing.",
      recommendations: ""
    },
    {
      category: "Handling",
      criteria: "Permanent deletion of personal data",
      score: 5,
      maxScore: 5,
      description: "Assesses whether users can permanently delete their personal data and how straightforward the process is.",
      recommendations: ""
    },
    {
      category: "Handling",
      criteria: "Third-party access to private personal data",
      score: 9,
      maxScore: 10,
      description: "Evaluates how the policy handles sharing personal data with third parties and what controls users have.",
      recommendations: "Consider providing more details about how Google Analytics data is protected."
    },
    {
      category: "Handling",
      criteria: "Law enforcement access to personal data",
      score: 3,
      maxScore: 5,
      description: "Assesses how the policy addresses sharing data with law enforcement and government agencies.",
      recommendations: "Consider adding information about how law enforcement requests are handled."
    },
    
    // Transparency category
    {
      category: "Transparency",
      criteria: "General security practices outlined",
      score: 2,
      maxScore: 3,
      description: "Evaluates whether the policy outlines security measures used to protect user data.",
      recommendations: "Consider providing more specific details about security measures implemented."
    },
    {
      category: "Transparency",
      criteria: "Policy's history availability",
      score: 5,
      maxScore: 5,
      description: "Assesses whether previous versions of the privacy policy are accessible to users."
    },
    {
      category: "Transparency",
      criteria: "Notification requirement in case of a data breach",
      score: 0,
      maxScore: 7,
      description: "Evaluates whether the policy commits to notifying users in case of a data breach.",
      recommendations: "The policy should explicitly commit to notifying users in case of a data breach and specify a timeline for such notifications."
    },
    {
      category: "Transparency",
      criteria: "Notification to users when policy is meaningfully changed",
      score: 5,
      maxScore: 5,
      description: "Assesses whether users are notified when the privacy policy changes significantly."
    },
    
    // Collection category
    {
      category: "Collection",
      criteria: "Collection of personal data from third parties",
      score: 10,
      maxScore: 10,
      description: "Evaluates whether the policy discloses collection of user data from third parties."
    },
    {
      category: "Collection",
      criteria: "Clarity on why personal data is collected",
      score: 10,
      maxScore: 10,
      description: "Assesses whether the policy clearly explains why personal data is collected."
    },
    {
      category: "Collection",
      criteria: "Control over non-critical personal data collection or use",
      score: 8,
      maxScore: 10,
      description: "Evaluates whether users have control over what non-essential data is collected or how it's used.",
      recommendations: "Consider providing more specific opt-out instructions for Google Analytics."
    },
    {
      category: "Collection",
      criteria: "Listing of personal data collected",
      score: 10,
      maxScore: 10,
      description: "Assesses whether the policy clearly lists what personal data is collected."
    }
  ],
  totalScore: 77,
  maxTotalScore: 90,
  analysisDate: new Date().toISOString().split('T')[0],
  lastUpdated: Date.now()
};