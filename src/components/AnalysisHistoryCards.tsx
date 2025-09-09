'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Clock, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AnalysisData {
  id: number;
  url: string;
  hostname: string;
  overall_score: number;
  privacy_grade: string;
  risk_level: string;
  gdpr_compliance: string;
  ccpa_compliance: string;
  created_at: string;
  analysis_data: {
    overall_score: number;
    privacy_grade: string;
    risk_level: string;
    regulatory_compliance: {
      gdpr_compliance: string;
      ccpa_compliance: string;
    };
  };
}

export function AnalysisHistoryCards() {
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/history?limit=12');
      if (!response.ok) {
        throw new Error('Failed to fetch analyses');
      }
      const data = await response.json();
      setAnalyses(data.analyses);
    } catch (err) {
      console.error('Error fetching analyses:', err);
      setError('Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Recent Analysis History
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore privacy analyses from our community
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <Button onClick={fetchAnalyses} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Analyses Yet</h3>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Be the first to analyze a privacy policy! Use our analyzer above to get started and contribute to our community database.
        </p>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <a href="#analyzer">Start Analysis</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Recent Analysis History
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Explore privacy analyses from our community
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>{analyses.length} recent analyses available</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {analyses.map((analysis) => (
          <Link 
            key={analysis.id} 
            href={`/analysis/${analysis.id}`}
            className="block group"
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-gray-200 group-hover:border-blue-300">
              <CardContent className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate text-sm">
                        {formatHostname(analysis.hostname)}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(analysis.created_at)}</span>
                  </div>
                </div>

                {/* Scores */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getGradeColor(analysis.privacy_grade)}`}>
                        {analysis.privacy_grade || 'N/A'}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">Grade</span>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(analysis.overall_score)}
                      </div>
                      <span className="text-xs text-gray-500">Score</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`w-full justify-center text-xs ${getRiskColor(analysis.risk_level)}`}
                  >
                    {analysis.risk_level?.replace('_', ' ') || 'Unknown'} Risk
                  </Badge>
                </div>

                {/* Compliance */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getComplianceIcon(analysis.gdpr_compliance)}
                      <span className="text-gray-700">GDPR</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-800' :
                      analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analysis.gdpr_compliance?.replace('_', ' ') || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getComplianceIcon(analysis.ccpa_compliance)}
                      <span className="text-gray-700">CCPA</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-800' :
                      analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analysis.ccpa_compliance?.replace('_', ' ') || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* View Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-700"
                >
                  View Analysis
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* View All Link */}
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/history">
            View All Analyses →
          </Link>
        </Button>
      </div>
    </div>
  );
}