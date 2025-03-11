import { PrivacyAnalysis } from '../types';

export const additionalPolicies: PrivacyAnalysis[] = [
  {
    siteName: "Flipkart",
    siteUrl: "https://www.flipkart.com/pages/privacypolicy",
    logoUrl: "https://www.google.com/s2/favicons?domain=flipkart.com&sz=128",
    screenshotUrl: "https://image.thum.io/get/width/600/crop/400/viewportWidth/1200/png/noanimate/https://www.flipkart.com/pages/privacypolicy",
    summary: "Flipkart's privacy policy provides moderate protection for user data with reasonable transparency in several areas. The policy explains what data is collected and how it's used for personalization and service improvement. While it addresses third-party sharing, it could provide more user controls and clearer opt-out mechanisms for marketing and data collection practices.",
    scores: [
      {
        category: "Handling",
        criteria: "Personally-targeted or behavioural marketing",
        score: 5,
        maxScore: 10,
        description: "Evaluates how the privacy policy handles targeted advertising and behavioral marketing.",
        recommendations: "Should provide clearer opt-out options for targeted advertising and better explain how user data is used for marketing purposes."
      },
      {
        category: "Handling",
        criteria: "Permanent deletion of personal data",
        score: 3,
        maxScore: 5,
        description: "Assesses whether users can permanently delete their personal data and how straightforward the process is.",
        recommendations: "Should clarify the timeline for complete data deletion and what data may be retained."
      },
      {
        category: "Handling",
        criteria: "Third-party access to private personal data",
        score: 5,
        maxScore: 10,
        description: "Evaluates how the policy handles sharing personal data with third parties and what controls users have.",
        recommendations: "Should provide more specific information about which third parties receive user data and improve user controls over third-party data sharing."
      },
      {
        category: "Handling",
        criteria: "Law enforcement access to personal data",
        score: 3,
        maxScore: 5,
        description: "Assesses how the policy addresses sharing data with law enforcement and government agencies.",
        recommendations: "Could provide more transparency about government data requests."
      },
      {
        category: "Transparency",
        criteria: "General security practices outlined",
        score: 2,
        maxScore: 3,
        description: "Evaluates whether the policy outlines security measures used to protect user data.",
        recommendations: "Could provide more specific details about security measures implemented."
      },
      {
        category: "Transparency",
        criteria: "Policy's history availability",
        score: 3,
        maxScore: 5,
        description: "Assesses whether previous versions of the privacy policy are accessible to users.",
        recommendations: "Should make previous policy versions accessible to users."
      },
      {
        category: "Transparency",
        criteria: "Notification requirement in case of a data breach",
        score: 3,
        maxScore: 7,
        description: "Evaluates whether the policy commits to notifying users in case of a data breach.",
        recommendations: "Should explicitly commit to notifying users in case of a data breach and specify a timeline for such notifications."
      },
      {
        category: "Transparency",
        criteria: "Notification to users when policy is meaningfully changed",
        score: 4,
        maxScore: 5,
        description: "Assesses whether users are notified when the privacy policy changes significantly.",
        recommendations: "Could better define what constitutes a significant change requiring notification."
      },
      {
        category: "Collection",
        criteria: "Collection of personal data from third parties",
        score: 6,
        maxScore: 10,
        description: "Evaluates whether the policy discloses collection of user data from third parties.",
        recommendations: "Should provide more details about what specific data is collected from third parties and which third parties provide this data."
      },
      {
        category: "Collection",
        criteria: "Clarity on why personal data is collected",
        score: 7,
        maxScore: 10,
        description: "Assesses whether the policy clearly explains why personal data is collected.",
        recommendations: "Could provide more specific explanations for why certain sensitive data points are necessary."
      },
      {
        category: "Collection",
        criteria: "Control over non-critical personal data collection or use",
        score: 5,
        maxScore: 10,
        description: "Evaluates whether users have control over what non-essential data is collected or how it's used.",
        recommendations: "Should provide more granular controls for specific types of non-essential data."
      },
      {
        category: "Collection",
        criteria: "Listing of personal data collected",
        score: 8,
        maxScore: 10,
        description: "Assesses whether the policy clearly lists what personal data is collected."
      }
    ],
    totalScore: 54,
    maxTotalScore: 90,
    analysisDate: "2024-02-15",
    lastUpdated: Date.now()
  },
  {
    siteName: "Myntra",
    siteUrl: "https://www.myntra.com/privacypolicy",
    logoUrl: "https://www.google.com/s2/favicons?domain=myntra.com&sz=128",
    screenshotUrl: "https://image.thum.io/get/width/600/crop/400/viewportWidth/1200/png/noanimate/https://www.myntra.com/privacypolicy",
    summary: "Myntra's privacy policy provides moderate protection for user data with reasonable transparency in several areas. The policy explains what data is collected and how it's used for personalization and service improvement. While it addresses third-party sharing, it could provide more user controls and clearer opt-out mechanisms for marketing and data collection practices.",
    scores: [
      {
        category: "Handling",
        criteria: "Personally-targeted or behavioural marketing",
        score: 5,
        maxScore: 10,
        description: "Evaluates how the privacy policy handles targeted advertising and behavioral marketing.",
        recommendations: "Should provide clearer opt-out options for targeted advertising and better explain how user data is used for marketing purposes."
      },
      {
        category: "Handling",
        criteria: "Permanent deletion of personal data",
        score: 3,
        maxScore: 5,
        description: "Assesses whether users can permanently delete their personal data and how straightforward the process is.",
        recommendations: "Should clarify the timeline for complete data deletion and what data may be retained."
      },
      {
        category: "Handling",
        criteria: "Third-party access to private personal data",
        score: 5,
        maxScore: 10,
        description: "Evaluates how the policy handles sharing personal data with third parties and what controls users have.",
        recommendations: "Should provide more specific information about which third parties receive user data and improve user controls over third-party data sharing."
      },
      {
        category: "Handling",
        criteria: "Law enforcement access to personal data",
        score: 3,
        maxScore: 5,
        description: "Assesses how the policy addresses sharing data with law enforcement and government agencies.",
        recommendations: "Could provide more transparency about government data requests."
      },
      {
        category: "Transparency",
        criteria: "General security practices outlined",
        score: 2,
        maxScore: 3,
        description: "Evaluates whether the policy outlines security measures used to protect user data.",
        recommendations: "Could provide more specific details about security measures implemented."
      },
      {
        category: "Transparency",
        criteria: "Policy's history availability",
        score: 3,
        maxScore: 5,
        description: "Assesses whether previous versions of the privacy policy are accessible to users.",
        recommendations: "Should make previous policy versions accessible to users."
      },
      {
        category: "Transparency",
        criteria: "Notification requirement in case of a data breach",
        score: 3,
        maxScore: 7,
        description: "Evaluates whether the policy commits to notifying users in case of a data breach.",
        recommendations: "Should explicitly commit to notifying users in case of a data breach and specify a timeline for such notifications."
      },
      {
        category: "Transparency",
        criteria: "Notification to users when policy is meaningfully changed",
        score: 4,
        maxScore: 5,
        description: "Assesses whether users are notified when the privacy policy changes significantly.",
        recommendations: "Could better define what constitutes a significant change requiring notification."
      },
      {
        category: "Collection",
        criteria: "Collection of personal data from third parties",
        score: 6,
        maxScore: 10,
        description: "Evaluates whether the policy discloses collection of user data from third parties.",
        recommendations: "Should provide more details about what specific data is collected from third parties and which third parties provide this data."
      },
      {
        category: "Collection",
        criteria: "Clarity on why personal data is collected",
        score: 7,
        maxScore: 10,
        description: "Assesses whether the policy clearly explains why personal data is collected.",
        recommendations: "Could provide more specific explanations for why certain sensitive data points are necessary."
      },
      {
        category: "Collection",
        criteria: "Control over non-critical personal data collection or use",
        score: 5,
        maxScore: 10,
        description: "Evaluates whether users have control over what non-essential data is collected or how it's used.",
        recommendations: "Should provide more granular controls for specific types of non-essential data."
      },
      {
        category: "Collection",
        criteria: "Listing of personal data collected",
        score: 8,
        maxScore: 10,
        description: "Assesses whether the policy clearly lists what personal data is collected."
      }
    ],
    totalScore: 54,
    maxTotalScore: 90,
    analysisDate: "2024-02-15",
    lastUpdated: Date.now()
  },
  {
    siteName: "Paytm",
    siteUrl: "https://paytm.com/about-us/our-policies",
    logoUrl: "https://www.google.com/s2/favicons?domain=paytm.com&sz=128",
    screenshotUrl: "https://image.thum.io/get/width/600/crop/400/viewportWidth/1200/png/noanimate/https://paytm.com/about-us/our-policies",
    summary: "Paytm's privacy policy demonstrates strong commitment to data protection, particularly for financial information. The policy clearly outlines data collection practices, security measures, and user rights. While it provides good transparency about data handling, there's room for improvement in areas like third-party data sharing controls and breach notification procedures.",
    scores: [
      {
        category: "Handling",
        criteria: "Personally-targeted or behavioural marketing",
        score: 7,
        maxScore: 10,
        description: "Evaluates how the privacy policy handles targeted advertising and behavioral marketing.",
        recommendations: "Could provide more granular opt-out options for different types of marketing communications."
      },
      {
        category: "Handling",
        criteria: "Permanent deletion of personal data",
        score: 4,
        maxScore: 5,
        description: "Assesses whether users can permanently delete their personal data and how straightforward the process is."
      },
      {
        category: "Handling",
        criteria: "Third-party access to private personal data",
        score: 6,
        maxScore: 10,
        description: "Evaluates how the policy handles sharing personal data with third parties and what controls users have.",
        recommendations: "Should provide more specific information about which third parties receive user data."
      },
      {
        category: "Handling",
        criteria: "Law enforcement access to personal data",
        score: 4,
        maxScore: 5,
        description: "Assesses how the policy addresses sharing data with law enforcement and government agencies."
      },
      {
        category: "Transparency",
        criteria: "General security practices outlined",
        score: 3,
        maxScore: 3,
        description: "Evaluates whether the policy outlines security measures used to protect user data."
      },
      {
        category: "Transparency",
        criteria: "Policy's history availability",
        score: 4,
        maxScore: 5,
        description: "Assesses whether previous versions of the privacy policy are accessible to users.",
        recommendations: "Could make previous policy versions more easily accessible."
      },
      {
        category: "Transparency",
        criteria: "Notification requirement in case of a data breach",
        score: 5,
        maxScore: 7,
        description: "Evaluates whether the policy commits to notifying users in case of a data breach.",
        recommendations: "Should specify a timeline for notification after discovery of a breach."
      },
      {
        category: "Transparency",
        criteria: "Notification to users when policy is meaningfully changed",
        score: 4,
        maxScore: 5,
        description: "Assesses whether users are notified when the privacy policy changes significantly.",
        recommendations: "Could better define what constitutes a significant change requiring notification."
      },
      {
        category: "Collection",
        criteria: "Collection of personal data from third parties",
        score: 8,
        maxScore: 10,
        description: "Evaluates whether the policy discloses collection of user data from third parties.",
        recommendations: "Could provide more details about specific third parties that provide data."
      },
      {
        category: "Collection",
        criteria: "Clarity on why personal data is collected",
        score: 9,
        maxScore: 10,
        description: "Assesses whether the policy clearly explains why personal data is collected."
      },
      {
        category: "Collection",
        criteria: "Control over non-critical personal data collection or use",
        score: 7,
        maxScore: 10,
        description: "Evaluates whether users have control over what non-essential data is collected or how it's used.",
        recommendations: "Should provide more granular controls for specific types of non-essential data."
      },
      {
        category: "Collection",
        criteria: "Listing of personal data collected",
        score: 9,
        maxScore: 10,
        description: "Assesses whether the policy clearly lists what personal data is collected."
      }
    ],
    totalScore: 70,
    maxTotalScore: 90,
    analysisDate: "2024-02-15",
    lastUpdated: Date.now()
  }
];