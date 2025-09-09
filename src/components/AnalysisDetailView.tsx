'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft, 
  Calendar, 
  Globe, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  ExternalLink,
  Download
} from 'lucide-react';

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
    categories?: Record<string, any>;
    recommendations?: string[];
    key_findings?: string[];
    summary?: string;
  };
}

interface Props {
  analysis: AnalysisData;
}

export function AnalysisDetailView({ analysis }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatHostname = (hostname: string) => {
    return hostname.replace(/^www\./, '');
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
      case 'A': return 'bg-green-100 text-green-800 border-green-300';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'F': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getComplianceIcon = (compliance: string) => {
    switch (compliance?.toUpperCase()) {
      case 'COMPLIANT': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PARTIALLY_COMPLIANT': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'NON_COMPLIANT': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const downloadReport = () => {
    const reportData = {
      website: formatHostname(analysis.hostname),
      url: analysis.url,
      analysis_date: analysis.created_at,
      overall_score: analysis.overall_score,
      privacy_grade: analysis.privacy_grade,
      risk_level: analysis.risk_level,
      gdpr_compliance: analysis.gdpr_compliance,
      ccpa_compliance: analysis.ccpa_compliance,
      full_analysis: analysis.analysis_data
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privacy-analysis-${formatHostname(analysis.hostname)}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {formatHostname(analysis.hostname)}
                  </h1>
                  <p className="text-sm text-gray-500">Privacy Policy Analysis</p>
                </div>
              </div>
            </div>

            <Button onClick={downloadReport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Analysis Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  {/* Privacy Grade */}
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2 mb-3 ${getGradeColor(analysis.privacy_grade)}`}>
                      <span className="text-3xl font-bold">{analysis.privacy_grade || 'N/A'}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Privacy Grade</h3>
                    <p className="text-sm text-gray-600">Overall assessment</p>
                  </div>

                  {/* Overall Score */}
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-3 ${getScoreColor(analysis.overall_score)}`}>
                      {Math.round(analysis.overall_score)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Privacy Score</h3>
                    <p className="text-sm text-gray-600">Out of 100 points</p>
                  </div>

                  {/* Risk Level */}
                  <div className="text-center">
                    <Badge 
                      variant="outline" 
                      className={`mb-3 text-sm px-3 py-2 ${getRiskColor(analysis.risk_level)}`}
                    >
                      {analysis.risk_level?.replace('_', ' ') || 'Unknown'}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 mb-1">Risk Level</h3>
                    <p className="text-sm text-gray-600">Privacy risk assessment</p>
                  </div>
                </div>

                {/* Summary */}
                {analysis.analysis_data.summary && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Analysis Summary</h4>
                    <p className="text-blue-800 text-sm">{analysis.analysis_data.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Findings */}
            {analysis.analysis_data.key_findings && analysis.analysis_data.key_findings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Key Findings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.analysis_data.key_findings.map((finding, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {analysis.analysis_data.recommendations && analysis.analysis_data.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.analysis_data.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Website Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Website Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-900">{formatHostname(analysis.hostname)}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={analysis.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Analysis Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{formatDate(analysis.created_at)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Analysis ID</label>
                  <div className="mt-1">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{analysis.id}</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* GDPR */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getComplianceIcon(analysis.gdpr_compliance)}
                    <div>
                      <h4 className="font-medium text-gray-900">GDPR</h4>
                      <p className="text-sm text-gray-500">General Data Protection Regulation</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-800' :
                      analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {analysis.gdpr_compliance?.replace('_', ' ') || 'Unknown'}
                  </Badge>
                </div>

                {/* CCPA */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getComplianceIcon(analysis.ccpa_compliance)}
                    <div>
                      <h4 className="font-medium text-gray-900">CCPA</h4>
                      <p className="text-sm text-gray-500">California Consumer Privacy Act</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-800' :
                      analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {analysis.ccpa_compliance?.replace('_', ' ') || 'Unknown'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/history">
                    <Shield className="w-4 h-4 mr-2" />
                    View All Analyses
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyze New Website
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start" onClick={downloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}