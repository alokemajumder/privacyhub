import { NextRequest, NextResponse } from 'next/server';
import { getRecentAnalyses, getAnalysisStats } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeStats = searchParams.get('stats') === 'true';

    const analyses = getRecentAnalyses(limit, offset);
    
    // Parse analysis_data back to JSON for each result
    const formattedAnalyses = analyses.map(analysis => ({
      ...analysis,
      analysis_data: JSON.parse(analysis.analysis_data)
    }));

    const response: {
      analyses: typeof formattedAnalyses;
      total: number;
      stats?: ReturnType<typeof getAnalysisStats>;
    } = {
      analyses: formattedAnalyses,
      total: analyses.length
    };

    if (includeStats) {
      response.stats = getAnalysisStats();
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analysis history' },
      { status: 500 }
    );
  }
}