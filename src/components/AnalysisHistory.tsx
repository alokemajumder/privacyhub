'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircularProgress } from '@/components/ui/circular-progress';
import { History, ExternalLink, TrendingUp, BarChart3, Clock, Globe } from 'lucide-react';

interface HistoryAnalysis {
  id: number;
  url: string;
  hostname: string;
  overall_score: number;
  privacy_grade: string;
  risk_level: string;
  gdpr_compliance: string;
  ccpa_compliance: string;
  created_at: string;
}

interface HistoryStats {
  totalAnalyses: number;
  averageScore: number;
  gradeDistribution: Array<{ privacy_grade: string; count: number }>;
  riskDistribution: Array<{ risk_level: string; count: number }>;
}

interface HistoryResponse {
  analyses: HistoryAnalysis[];
  total: number;
  stats?: HistoryStats;
}

export function AnalysisHistory() {
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history?limit=6&stats=true');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'text-green-600 bg-green-50 border-green-200';
    if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (['C+', 'C', 'C-'].includes(grade)) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (['D+', 'D', 'D-'].includes(grade)) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'EXEMPLARY': return 'text-green-700 bg-green-100';
      case 'LOW': return 'text-green-600 bg-green-50';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-50';
      case 'MODERATE-HIGH': return 'text-orange-600 bg-orange-50';
      case 'HIGH': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.analyses.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <History className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Analysis History</h3>
          <p className="text-gray-500 max-w-sm">
            Your privacy policy analysis history will appear here once you start analyzing websites.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <History className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
            <p className="text-gray-600">Recent privacy policy analyses</p>
          </div>
        </div>
        
        {history.stats && (
          <Button
            variant="outline"
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </Button>
        )}
      </div>

      {/* Statistics Dashboard */}
      {showStats && history.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{history.stats.totalAnalyses}</div>
              <div className="text-sm text-blue-700">Total Analyses</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="relative">
                <CircularProgress 
                  value={history.stats.averageScore * 10} 
                  size={60}
                  strokeWidth={6}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-900">
                    {history.stats.averageScore.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-green-700 mt-2">Avg Score</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">
                {new Set(history.analyses.map(a => a.hostname)).size}
              </div>
              <div className="text-sm text-purple-700">Unique Sites</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">
                {history.stats.gradeDistribution.find(g => g.privacy_grade === 'A')?.count || 0}
              </div>
              <div className="text-sm text-orange-700">Grade A Sites</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analysis History Grid */}
      <div className="grid gap-4">
        {history.analyses.map((analysis) => (
          <Card key={analysis.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-200">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4 items-center">
                {/* Website Info */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold text-sm">
                      {analysis.hostname.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {analysis.hostname}
                      </h3>
                      <a 
                        href={analysis.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-1"
                      >
                        View Policy
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(analysis.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scores */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <CircularProgress 
                        value={analysis.overall_score * 10} 
                        size={50}
                        strokeWidth={5}
                        showValue={false}
                      />
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          {analysis.overall_score.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-col gap-2">
                  <Badge className={`px-3 py-1 border ${getGradeColor(analysis.privacy_grade)} justify-center`}>
                    Grade {analysis.privacy_grade}
                  </Badge>
                  <Badge className={`px-2 py-1 text-xs ${getRiskColor(analysis.risk_level)} justify-center`}>
                    {analysis.risk_level.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View More Button */}
      {history.total > 6 && (
        <div className="text-center">
          <Button variant="outline" className="flex items-center gap-2 mx-auto">
            <History className="h-4 w-4" />
            View More Analyses
          </Button>
        </div>
      )}
    </div>
  );
}