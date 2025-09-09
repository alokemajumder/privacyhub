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


  const getComplianceIcon = (compliance: string) => {
    switch (compliance?.toUpperCase()) {
      case 'COMPLIANT': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PARTIALLY_COMPLIANT': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'NON_COMPLIANT': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
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
      dpdp_act_compliance: analysis.dpdp_act_compliance,
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
                  <p className="text-sm text-gray-500">How They Handle Your Personal Data</p>
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
                  Privacy Report Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Main Metrics Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  {/* Privacy Grade Card */}
                  <div className={`relative p-6 rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${
                    analysis.privacy_grade === 'A' ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' :
                    analysis.privacy_grade === 'B' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300' :
                    analysis.privacy_grade === 'C' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300' :
                    analysis.privacy_grade === 'D' ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300' :
                    'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
                  }`}>
                    <div className="text-center">
                      {/* Large Grade Letter */}
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full font-black text-4xl shadow-lg border-4 bg-white mb-4 ${
                        analysis.privacy_grade === 'A' ? 'text-green-700 border-green-400' :
                        analysis.privacy_grade === 'B' ? 'text-blue-700 border-blue-400' :
                        analysis.privacy_grade === 'C' ? 'text-yellow-700 border-yellow-400' :
                        analysis.privacy_grade === 'D' ? 'text-orange-700 border-orange-400' :
                        'text-red-700 border-red-400'
                      }`}>
                        {analysis.privacy_grade || 'F'}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Privacy Grade</h3>
                      <p className="text-sm text-gray-600 mb-3">Like a school report card</p>
                      
                      {/* Grade Description */}
                      <div className="inline-flex px-3 py-1.5 bg-white/80 backdrop-blur rounded-full text-xs font-semibold">
                        <span className={`${
                          analysis.privacy_grade === 'A' ? 'text-green-700' :
                          analysis.privacy_grade === 'B' ? 'text-blue-700' :
                          analysis.privacy_grade === 'C' ? 'text-yellow-700' :
                          analysis.privacy_grade === 'D' ? 'text-orange-700' :
                          'text-red-700'
                        }`}>
                          {analysis.privacy_grade === 'A' ? 'Excellent Protection' :
                           analysis.privacy_grade === 'B' ? 'Good Protection' :
                           analysis.privacy_grade === 'C' ? 'Fair Protection' :
                           analysis.privacy_grade === 'D' ? 'Poor Protection' :
                           'Failing Protection'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Score Card */}
                  <div className={`relative p-6 rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${
                    analysis.overall_score >= 80 ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' :
                    analysis.overall_score >= 60 ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300' :
                    analysis.overall_score >= 40 ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300' :
                    analysis.overall_score >= 20 ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300' :
                    'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
                  }`}>
                    <div className="text-center">
                      {/* Score Display */}
                      <div className="mb-4">
                        <div className={`text-5xl font-black mb-1 ${
                          analysis.overall_score >= 80 ? 'text-green-700' :
                          analysis.overall_score >= 60 ? 'text-blue-700' :
                          analysis.overall_score >= 40 ? 'text-yellow-700' :
                          analysis.overall_score >= 20 ? 'text-orange-700' :
                          'text-red-700'
                        }`}>
                          {Math.round(analysis.overall_score)}
                        </div>
                        <div className="text-sm font-medium text-gray-600">out of 100</div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Privacy Score</h3>
                      <p className="text-sm text-gray-600 mb-3">How well they protect you</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-white/50 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
                            analysis.overall_score >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            analysis.overall_score >= 60 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                            analysis.overall_score >= 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            analysis.overall_score >= 20 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${Math.min(analysis.overall_score, 100)}%` }}
                        />
                      </div>
                      
                      {/* Range Labels */}
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Level Card */}
                  <div className={`relative p-6 rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${
                    analysis.risk_level === 'LOW' ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' :
                    analysis.risk_level === 'MODERATE' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300' :
                    analysis.risk_level === 'MODERATE-HIGH' ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300' :
                    'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
                  }`}>
                    <div className="text-center">
                      {/* Risk Icon */}
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 border-4 bg-white shadow-lg ${
                        analysis.risk_level === 'LOW' ? 'border-green-400' :
                        analysis.risk_level === 'MODERATE' ? 'border-yellow-400' :
                        analysis.risk_level === 'MODERATE-HIGH' ? 'border-orange-400' :
                        'border-red-400'
                      }`}>
                        <AlertTriangle className={`w-8 h-8 ${
                          analysis.risk_level === 'LOW' ? 'text-green-600' :
                          analysis.risk_level === 'MODERATE' ? 'text-yellow-600' :
                          analysis.risk_level === 'MODERATE-HIGH' ? 'text-orange-600' :
                          'text-red-600'
                        }`} />
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Risk Level</h3>
                      <p className="text-sm text-gray-600 mb-3">How risky for your privacy</p>
                      
                      {/* Risk Badge */}
                      <div className={`inline-flex px-4 py-2 rounded-full font-bold text-sm shadow-sm border-2 bg-white/80 ${
                        analysis.risk_level === 'LOW' ? 'text-green-700 border-green-300' :
                        analysis.risk_level === 'MODERATE' ? 'text-yellow-700 border-yellow-300' :
                        analysis.risk_level === 'MODERATE-HIGH' ? 'text-orange-700 border-orange-300' :
                        'text-red-700 border-red-300'
                      }`}>
                        {analysis.risk_level?.replace('_', ' ') || 'Unknown'} Risk
                      </div>
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
                        <h4 className="text-lg font-bold text-blue-900 mb-3">What This Means for You</h4>
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
                    Important Things to Know
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
                    How to Protect Yourself
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
                  Legal Protection Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Horizontal Compliance Cards */}
                <div className="grid gap-6">
                  {/* GDPR Compliance Card */}
                  <div className={`relative p-5 rounded-xl border-2 shadow-sm transition-all duration-200 hover:shadow-md ${
                    analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-50 border-green-200' :
                    analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-100' :
                        analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        {getComplianceIcon(analysis.gdpr_compliance)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">GDPR</h4>
                        <p className="text-sm text-gray-600">European Union</p>
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
                    
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
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
                  <div className={`relative p-5 rounded-xl border-2 shadow-sm transition-all duration-200 hover:shadow-md ${
                    analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-50 border-green-200' :
                    analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-100' :
                        analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        {getComplianceIcon(analysis.ccpa_compliance)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">CCPA</h4>
                        <p className="text-sm text-gray-600">California, USA</p>
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
                    
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
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

                  {/* DPDP Act 2023 Compliance Card */}
                  {analysis.dpdp_act_compliance && (
                    <div className={`relative p-5 rounded-xl border-2 shadow-sm transition-all duration-200 hover:shadow-md ${
                      analysis.dpdp_act_compliance === 'COMPLIANT' ? 'bg-green-50 border-green-200' :
                      analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          analysis.dpdp_act_compliance === 'COMPLIANT' ? 'bg-green-100' :
                          analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          {getComplianceIcon(analysis.dpdp_act_compliance)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">DPDP Act 2023</h4>
                          <p className="text-sm text-gray-600">India</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`px-3 py-1 font-medium border-2 ${
                            analysis.dpdp_act_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-800 border-green-300' :
                            analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          {analysis.dpdp_act_compliance?.replace('_', ' ') || 'Unknown'}
                        </Badge>
                      </div>
                      
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
                          <span>Compliance Level</span>
                          <span>
                            {analysis.dpdp_act_compliance === 'COMPLIANT' ? '100%' :
                             analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? '65%' : '25%'}
                          </span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 shadow-inner">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              analysis.dpdp_act_compliance === 'COMPLIANT' ? 'bg-green-500' :
                              analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: 
                              analysis.dpdp_act_compliance === 'COMPLIANT' ? '100%' :
                              analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? '65%' : '25%'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
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