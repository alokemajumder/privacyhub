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
      analysis_data: JSON.parse(analysis.analysis_data)
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

  const hostname = analysis.hostname.replace(/^www\./, '');
  
  return {
    title: `${hostname} Privacy Analysis | PrivacyHub.in`,
    description: `Detailed privacy policy analysis for ${hostname}. Grade: ${analysis.privacy_grade}, Score: ${Math.round(analysis.overall_score)}. Comprehensive GDPR & CCPA compliance review.`,
    openGraph: {
      title: `${hostname} Privacy Analysis | PrivacyHub.in`,
      description: `Privacy grade ${analysis.privacy_grade} with ${Math.round(analysis.overall_score)} score. ${analysis.risk_level} risk level.`,
      type: 'website',
      url: `https://privacyhub.in/analysis/${params.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hostname} Privacy Analysis | PrivacyHub.in`,
      description: `Privacy grade ${analysis.privacy_grade} with ${Math.round(analysis.overall_score)} score. ${analysis.risk_level} risk level.`,
    },
  };
}

export default async function AnalysisPage({ params }: Props) {
  const analysis = await getAnalysis(params.id);
  
  if (!analysis) {
    notFound();
  }

  return <AnalysisDetailView analysis={analysis} />;
}