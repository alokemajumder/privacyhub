import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDatabase } from '@/lib/database';
import { AnalysisDetailView } from '@/components/AnalysisDetailView';

interface Props {
  params: { id: string };
}

async function getAnalysis(id: string) {
  try {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT * FROM analyses
      WHERE id = ?
    `);
    
    const analysis = stmt.get(id);
    
    if (!analysis) {
      return null;
    }

    // Parse the analysis_data JSON
    return {
      ...analysis,
      analysis_data: JSON.parse((analysis as unknown as { analysis_data: string }).analysis_data)
    };
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const analysis = await getAnalysis(params.id);
  
  if (!analysis) {
    return {
      title: 'Analysis Not Found | PrivacyHub.in',
    };
  }

  const hostname = (analysis as unknown as { hostname: string }).hostname.replace(/^www\./, '');
  
  return {
    title: `${hostname} Privacy Analysis | PrivacyHub.in`,
    description: `Detailed privacy policy analysis for ${hostname}. Grade: ${(analysis as unknown as { privacy_grade: string }).privacy_grade}, Score: ${Math.round((analysis as unknown as { overall_score: number }).overall_score)}. Comprehensive GDPR, CCPA & DPDP Act 2023 compliance review.`,
    openGraph: {
      title: `${hostname} Privacy Analysis | PrivacyHub.in`,
      description: `Privacy grade ${(analysis as unknown as { privacy_grade: string }).privacy_grade} with ${Math.round((analysis as unknown as { overall_score: number }).overall_score)} score. ${(analysis as unknown as { risk_level: string }).risk_level} risk level.`,
      type: 'website',
      url: `https://privacyhub.in/analysis/${params.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hostname} Privacy Analysis | PrivacyHub.in`,
      description: `Privacy grade ${(analysis as unknown as { privacy_grade: string }).privacy_grade} with ${Math.round((analysis as unknown as { overall_score: number }).overall_score)} score. ${(analysis as unknown as { risk_level: string }).risk_level} risk level.`,
    },
  };
}

export default async function AnalysisPage({ params }: Props) {
  const analysis = await getAnalysis(params.id);
  
  if (!analysis) {
    notFound();
  }

  return <AnalysisDetailView analysis={analysis as unknown as typeof analysis & { id: number; url: string; hostname: string; overall_score: number; privacy_grade: string; risk_level: string; gdpr_compliance: string; ccpa_compliance: string; created_at: string }} />;
}