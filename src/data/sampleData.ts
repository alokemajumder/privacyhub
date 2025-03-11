import { PrivacyAnalysis } from '../types';

export const sampleAnalysis: PrivacyAnalysis = {
  siteName: "Example Website",
  siteUrl: "https://example.com/privacy",
  logoUrl: "https://via.placeholder.com/150",
  screenshotUrl: "https://image.thum.io/get/width/600/crop/400/viewportWidth/1200/png/noanimate/https://example.com",
  summary: "This privacy policy provides reasonable protection for user data with good transparency in several areas. There are some aspects that could be improved, particularly around third-party data sharing and user control. Strengths include permanent deletion of personal data, policy's history availability, and clarity on why personal data is collected. Areas for improvement include third-party access to private personal data, notification requirement in case of a data breach, and collection of personal data from third parties.",
  scores: [
    // Handling category
    {
      category: "Handling",
      criteria: "Personally-targeted or behavioural marketing",
      score: 4,
      maxScore: 10,
      description: "Evaluates how the privacy policy handles targeted advertising and behavioral marketing.",
      recommendations: "The policy should provide clearer options for opting out of targeted advertising and better explain how user data is used for marketing purposes."
    },
    {
      category: "Handling",
      criteria: "Permanent deletion of personal data",
      score: 5,
      maxScore: 5,
      description: "Assesses whether users can permanently delete their personal data and how straightforward the process is."
    },
    {
      category: "Handling",
      criteria: "Third-party access to private personal data",
      score: 0,
      maxScore: 10,
      description: "Evaluates how the policy handles sharing personal data with third parties and what controls users have.",
      recommendations: "The policy should clearly list which third parties receive user data and provide options for users to control this sharing."
    },
    {
      category: "Handling",
      criteria: "Law enforcement access to personal data",
      score: 3,
      maxScore: 5,
      description: "Assesses how the policy addresses sharing data with law enforcement and government agencies.",
      recommendations: "Consider adding transparency reporting about government data requests and clarifying user notification procedures."
    },
    
    // Transparency category
    {
      category: "Transparency",
      criteria: "General security practices outlined",
      score: 2,
      maxScore: 3,
      description: "Evaluates whether the policy outlines security measures used to protect user data.",
      recommendations: "Consider providing more details about security practices and regular security assessments."
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
      score: 0,
      maxScore: 5,
      description: "Assesses whether users are notified when the privacy policy changes significantly.",
      recommendations: "The policy should commit to notifying users about significant changes and explain what constitutes a significant change."
    },
    
    // Collection category
    {
      category: "Collection",
      criteria: "Collection of personal data from third parties",
      score: 0,
      maxScore: 10,
      description: "Evaluates whether the policy discloses collection of user data from third parties.",
      recommendations: "The policy should clearly disclose what data is collected from third parties and identify those third parties."
    },
    {
      category: "Collection",
      criteria: "Clarity on why personal data is collected",
      score: 7,
      maxScore: 10,
      description: "Assesses whether the policy clearly explains why personal data is collected.",
      recommendations: "Consider providing more specific explanations for why certain sensitive data points are necessary."
    },
    {
      category: "Collection",
      criteria: "Control over non-critical personal data collection or use",
      score: 3,
      maxScore: 10,
      description: "Evaluates whether users have control over what non-essential data is collected or how it's used.",
      recommendations: "The policy should provide clear options for users to control what non-essential data is collected and how it's used."
    },
    {
      category: "Collection",
      criteria: "Listing of personal data collected",
      score: 7,
      maxScore: 10,
      description: "Assesses whether the policy clearly lists what personal data is collected.",
      recommendations: "Consider making the data collection list more detailed and explaining why each type of data is necessary."
    }
  ],
  totalScore: 36,
  maxTotalScore: 90,
  analysisDate: "2025-01-01",
  lastUpdated: Date.now()
};