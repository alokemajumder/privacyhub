import { PrivacyAnalysis } from '../types';
import { additionalPolicies } from './additionalPolicies';

// Combine original popular policies with additional policies
export const popularPolicies: PrivacyAnalysis[] = [
  {
    siteName: "Google",
    siteUrl: "https://policies.google.com/privacy?hl=en-IN",
    logoUrl: "https://www.google.com/s2/favicons?domain=google.com&sz=128",
    screenshotUrl: "https://image.thum.io/get/width/600/crop/400/viewportWidth/1200/png/noanimate/https://policies.google.com/privacy",
    summary: "Google's privacy policy is comprehensive and transparent about data collection practices. It clearly explains what data is collected, how it's used, and provides users with controls over their information. The policy addresses data sharing with third parties and law enforcement, though some users may find the extensive data collection concerning.",
    scores: [
      {
        category: "Handling",
        criteria: "Personally-targeted or behavioural marketing",
        score: 6,
        maxScore: 10,
        description: "Evaluates how the privacy policy handles targeted advertising and behavioral marketing.",
        recommendations: "Could provide more granular opt-out options for different types of targeted advertising."
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
        score: 7,
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
        score: 5,
        maxScore: 5,
        description: "Assesses whether previous versions of the privacy policy are accessible to users."
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
        score: 5,
        maxScore: 5,
        description: "Assesses whether users are notified when the privacy policy changes significantly."
      },
      {
        category: "Collection",
        criteria: "Collection of personal data from third parties",
        score: 6,
        maxScore: 10,
        description: "Evaluates whether the policy discloses collection of user data from third parties.",
        recommendations: "Should provide more details about what specific data is collected from third parties."
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
        score: 8,
        maxScore: 10,
        description: "Evaluates whether users have control over what non-essential data is collected or how it's used.",
        recommendations: "Could provide more granular controls for specific types of non-essential data."
      },
      {
        category: "Collection",
        criteria: "Listing of personal data collected",
        score: 9,
        maxScore: 10,
        description: "Assesses whether the policy clearly lists what personal data is collected."
      }
    ],
    totalScore: 71,
    maxTotalScore: 90,
    analysisDate: "2024-02-15",
    lastUpdated: Date.now()
  },
  ...additionalPolicies
];