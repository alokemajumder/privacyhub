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
    categories?: Record<string, unknown>;
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
              <CardContent className="p-8">
                {/* Main Metrics Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  {/* Privacy Grade Circle */}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center">
                      {/* Circular Progress Ring */}
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        {/* Background Circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          className="opacity-30"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className={`transition-all duration-1000 ${
                            analysis.privacy_grade === 'A' ? 'stroke-green-500' :
                            analysis.privacy_grade === 'B' ? 'stroke-blue-500' :
                            analysis.privacy_grade === 'C' ? 'stroke-yellow-500' :
                            analysis.privacy_grade === 'D' ? 'stroke-orange-500' :
                            'stroke-red-500'
                          }`}
                          strokeDasharray={`${2 * Math.PI * 50}`}
                          strokeDashoffset={`${2 * Math.PI * 50 * (1 - (analysis.overall_score / 100))}`}
                        />
                      </svg>
                      {/* Grade Letter */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl border-4 shadow-lg bg-white ${getGradeColor(analysis.privacy_grade)}`}>
                          {analysis.privacy_grade || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy Grade</h3>
                      <p className="text-gray-600">Overall Assessment</p>
                      <div className="mt-2 px-4 py-2 bg-gray-50 rounded-full">
                        <span className="text-sm font-medium text-gray-700">
                          {analysis.privacy_grade === 'A' ? 'Excellent' :
                           analysis.privacy_grade === 'B' ? 'Good' :
                           analysis.privacy_grade === 'C' ? 'Fair' :
                           analysis.privacy_grade === 'D' ? 'Poor' :
                           'Failing'} Privacy Protection
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Overall Score Meter */}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                      {/* Circular Score Meter */}
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        {/* Background Circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#f3f4f6"
                          strokeWidth="12"
                        />
                        {/* Score Progress */}
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          strokeWidth="12"
                          strokeLinecap="round"
                          className={`transition-all duration-1000 ${getScoreColor(analysis.overall_score).replace('text-', 'stroke-')}`}
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - (analysis.overall_score / 100))}`}
                        />
                      </svg>
                      {/* Score Number */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className={`text-4xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                          {Math.round(analysis.overall_score)}
                        </div>
                        <div className="text-sm font-medium text-gray-500 mt-1">out of 100</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy Score</h3>
                      <p className="text-gray-600">Quantitative Rating</p>
                      {/* Score Range Indicator */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Poor</span>
                          <span>Excellent</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
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
                    </div>
                  </div>

                  {/* Risk Level Indicator */}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                      {/* Risk Level Visual */}
                      <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${getRiskColor(analysis.risk_level)} shadow-lg`}>
                        <div className="text-center">
                          <AlertTriangle className={`w-8 h-8 mb-2 mx-auto ${
                            analysis.risk_level === 'HIGH' ? 'text-red-700' :
                            analysis.risk_level === 'MODERATE-HIGH' ? 'text-orange-700' :
                            analysis.risk_level === 'MODERATE' ? 'text-yellow-700' :
                            analysis.risk_level === 'LOW' ? 'text-green-700' :
                            'text-blue-700'
                          }`} />
                          <div className={`text-sm font-bold ${
                            analysis.risk_level === 'HIGH' ? 'text-red-800' :
                            analysis.risk_level === 'MODERATE-HIGH' ? 'text-orange-800' :
                            analysis.risk_level === 'MODERATE' ? 'text-yellow-800' :
                            analysis.risk_level === 'LOW' ? 'text-green-800' :
                            'text-blue-800'
                          }`}>
                            {analysis.risk_level?.replace('_', ' ') || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Risk Level</h3>
                      <p className="text-gray-600">Privacy Risk Assessment</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-3 px-4 py-2 text-sm font-medium border-2 ${getRiskColor(analysis.risk_level)}`}
                      >
                        {analysis.risk_level?.replace('_', ' ') || 'Unknown'} Risk
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                {analysis.analysis_data.summary && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Info className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-blue-900 mb-3">Analysis Summary</h4>
                        <p className="text-blue-800 leading-relaxed">{analysis.analysis_data.summary}</p>
                      </div>
                    </div>
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
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Regulatory Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* GDPR Compliance Card */}
                <div className={`relative p-5 rounded-xl border-2 shadow-sm transition-all duration-200 ${
                  analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-50 border-green-200 hover:shadow-md' :
                  analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-50 border-yellow-200 hover:shadow-md' :
                  'bg-red-50 border-red-200 hover:shadow-md'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-100' :
                        analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        {getComplianceIcon(analysis.gdpr_compliance)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">GDPR Compliance</h4>
                        <p className="text-sm text-gray-600 mb-2">General Data Protection Regulation</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-white px-2 py-1 rounded-full font-medium text-gray-700">
                            European Union
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 font-medium border-2 ${
                        analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-800 border-green-300' :
                        analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                        'bg-red-100 text-red-800 border-red-300'
                      }`}
                    >
                      {analysis.gdpr_compliance?.replace('_', ' ') || 'Unknown'}
                    </Badge>
                  </div>
                  
                  {/* Compliance Score Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                      <span>Compliance Level</span>
                      <span>
                        {analysis.gdpr_compliance === 'COMPLIANT' ? '100%' :
                         analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? '65%' : '25%'}
                      </span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2 shadow-inner">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-500' :
                          analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: 
                          analysis.gdpr_compliance === 'COMPLIANT' ? '100%' :
                          analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? '65%' : '25%'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* CCPA Compliance Card */}
                <div className={`relative p-5 rounded-xl border-2 shadow-sm transition-all duration-200 ${
                  analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-50 border-green-200 hover:shadow-md' :
                  analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-50 border-yellow-200 hover:shadow-md' :
                  'bg-red-50 border-red-200 hover:shadow-md'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-100' :
                        analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        {getComplianceIcon(analysis.ccpa_compliance)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">CCPA Compliance</h4>
                        <p className="text-sm text-gray-600 mb-2">California Consumer Privacy Act</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-white px-2 py-1 rounded-full font-medium text-gray-700">
                            California, USA
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 font-medium border-2 ${
                        analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-800 border-green-300' :
                        analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                        'bg-red-100 text-red-800 border-red-300'
                      }`}
                    >
                      {analysis.ccpa_compliance?.replace('_', ' ') || 'Unknown'}
                    </Badge>
                  </div>
                  
                  {/* Compliance Score Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                      <span>Compliance Level</span>
                      <span>
                        {analysis.ccpa_compliance === 'COMPLIANT' ? '100%' :
                         analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? '65%' : '25%'}
                      </span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2 shadow-inner">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-500' :
                          analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: 
                          analysis.ccpa_compliance === 'COMPLIANT' ? '100%' :
                          analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? '65%' : '25%'
                        }}
                      />
                    </div>
                  </div>
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
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Help Us Improve</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700" 
                      onClick={() => window.open(`mailto:feedback@privacyhub.in?subject=Analysis Feedback - ${formatHostname(analysis.hostname)}&body=Analysis ID: ${analysis.id}%0D%0A%0D%0APlease describe any issues you found with this analysis:%0D%0A`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      User Feedback
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-green-50 hover:bg-green-100 border-green-200 text-green-700" 
                      onClick={() => window.open(`mailto:siteowner@privacyhub.in?subject=Site Owner Feedback - ${formatHostname(analysis.hostname)}&body=Analysis ID: ${analysis.id}%0D%0AWebsite: ${analysis.url}%0D%0A%0D%0AAs the owner/representative of ${formatHostname(analysis.hostname)}, I would like to provide feedback on your privacy analysis:%0D%0A`, '_blank')}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Site Owner Feedback
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Your feedback helps us improve our analysis accuracy and provide better privacy insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}