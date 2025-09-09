'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Clock, TrendingUp, AlertTriangle, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface AnalysisData {
  id: number;
  url: string;
  hostname: string;
  overall_score: number;
  privacy_grade: string;
  risk_level: string;
  gdpr_compliance: string;
  ccpa_compliance: string;
  dpdp_act_compliance?: string;
  created_at: string;
  analysis_data: {
    overall_score: number;
    privacy_grade: string;
    risk_level: string;
    regulatory_compliance: {
      gdpr_compliance: string;
      ccpa_compliance: string;
      dpdp_act_compliance?: string;
    };
  };
}

export function AnalysisHistoryCards() {
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchAnalyses = useCallback(async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const currentCount = reset ? 0 : analyses.length;
      const response = await fetch(`/api/history?limit=24&offset=${currentCount}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analyses');
      }
      const data = await response.json();
      
      if (reset) {
        setAnalyses(data.analyses);
      } else {
        setAnalyses(prev => [...prev, ...data.analyses]);
      }
      
      // Check if there might be more analyses
      setHasMore(data.analyses.length === 24);
    } catch (err) {
      console.error('Error fetching analyses:', err);
      setError('Failed to load analysis history');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [analyses.length]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MODERATE-HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      case 'EXEMPLARY': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getComplianceIcon = (compliance: string) => {
    switch (compliance?.toUpperCase()) {
      case 'COMPLIANT': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'PARTIALLY_COMPLIANT': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'NON_COMPLIANT': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatHostname = (hostname: string) => {
    return hostname.replace(/^www\./, '');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-medium text-slate-600 mb-4">
            <Clock className="w-4 h-4" />
            Loading Recent Analyses...
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Analysis History</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => fetchAnalyses()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Shield className="w-20 h-20 text-slate-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Building Our Community Database</h3>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Be the first to analyze a privacy policy and help build our global community database. 
            All analyses are publicly shared to help others make informed privacy decisions.
          </p>
          <Button size="lg" asChild className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3">
            <a href="#analyzer">Analyze First Policy</a>
          </Button>
          <p className="text-sm text-slate-500 mt-4">
            Every analysis is stored globally and visible to all visitors
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {analyses.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-full w-fit mx-auto">
          <TrendingUp className="w-4 h-4" />
          <span>{analyses.length} community analyses</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyses.map((analysis) => (
          <Link 
            key={analysis.id} 
            href={`/analysis/${analysis.id}`}
            className="block group"
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-200 group-hover:border-blue-400 bg-white">
              <CardContent className="p-6">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 truncate text-base leading-tight">
                          {formatHostname(analysis.hostname)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>{formatDate(analysis.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Metrics Section */}
                <div className="mb-6">
                  {/* Score and Grade Display */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="space-y-2">
                      {/* Privacy Grade */}
                      <div className="text-center">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center font-bold text-xl border-2 shadow-sm ${getGradeColor(analysis.privacy_grade)}`}>
                          {analysis.privacy_grade || 'N/A'}
                        </div>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Grade</p>
                          <p className="text-sm text-gray-700 font-medium">Privacy Rating</p>
                        </div>
                      </div>
                      
                      {/* Privacy Score */}
                      <div className="text-center">
                        <div className="relative">
                          <div className={`text-3xl font-bold ${getScoreColor(analysis.overall_score)} mb-1`}>
                            {Math.round(analysis.overall_score)}
                            <span className="text-lg text-gray-500 font-normal">/100</span>
                          </div>
                          {/* Score Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                analysis.overall_score >= 80 ? 'bg-green-500' :
                                analysis.overall_score >= 60 ? 'bg-blue-500' :
                                analysis.overall_score >= 40 ? 'bg-yellow-500' :
                                analysis.overall_score >= 20 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(analysis.overall_score, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Score</p>
                          <p className="text-sm text-gray-700 font-medium">Privacy Points</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Risk Level Badge */}
                  <div className="mb-4">
                    <Badge 
                      variant="outline" 
                      className={`w-full justify-center py-2 text-sm font-medium border-2 ${getRiskColor(analysis.risk_level)}`}
                    >
                      {analysis.risk_level?.replace('_', ' ') || 'Unknown'} Risk Level
                    </Badge>
                  </div>
                </div>

                {/* Compliance Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Regulatory Compliance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getComplianceIcon(analysis.gdpr_compliance)}
                        <div>
                          <span className="text-sm font-medium text-gray-900">GDPR</span>
                          <p className="text-xs text-gray-500">General Data Protection</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-800 border border-green-200' :
                        analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {analysis.gdpr_compliance?.replace('_', ' ') || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getComplianceIcon(analysis.ccpa_compliance)}
                        <div>
                          <span className="text-sm font-medium text-gray-900">CCPA</span>
                          <p className="text-xs text-gray-500">California Consumer Privacy</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-800 border border-green-200' :
                        analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {analysis.ccpa_compliance?.replace('_', ' ') || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  size="default" 
                  className="w-full font-medium group-hover:bg-blue-50 group-hover:border-blue-500 group-hover:text-blue-700 transition-all duration-200"
                >
                  View Full Analysis
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => fetchAnalyses(false)}
            disabled={loadingMore}
            className="min-w-[200px]"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-2"></div>
                Loading...
              </>
            ) : (
              'Load More Analyses'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}