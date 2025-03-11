export interface PrivacyScore {
  category: string;
  criteria: string;
  score: number;
  maxScore: number;
  description?: string;
  recommendations?: string;
}

export interface PrivacyAnalysis {
  id?: number;
  siteName: string;
  siteUrl: string;
  logoUrl: string;
  screenshotUrl: string;
  scores: PrivacyScore[];
  totalScore: number;
  maxTotalScore: number;
  analysisDate: string;
  summary?: string;
  keyFindings?: string[];
  lastUpdated?: number;
  brandName?: string;
}

export interface PrivacyPolicyContent {
  url: string;
  title: string;
  content: string;
  hostname: string;
  favicon: string;
}