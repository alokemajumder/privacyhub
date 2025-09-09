// Basic types for the Next.js version
export interface PrivacyScore {
  id: string;
  name: string;
  category: string;
  score: number;
  maxScore: number;
  explanation: string;
  recommendations: string[];
}

export interface PrivacyAnalysis {
  id?: number;
  siteName: string;
  brandName?: string;
  siteUrl: string;
  logoUrl?: string;
  screenshotUrl?: string;
  scores: PrivacyScore[];
  totalScore: number;
  maxTotalScore: number;
  summary: string;
  analysisDate: string;
  lastUpdated: number;
  privacyPolicyUrl?: string;
  privacyPolicyContent?: string;
}

export interface AnalysisStats {
  totalAnalyses: number;
  averageScore: number;
  topCategories: Array<{
    category: string;
    averageScore: number;
  }>;
}