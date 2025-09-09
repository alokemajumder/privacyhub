'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  ExternalLink,
  Download,
  Eye,
  DollarSign,
  Lock,
  UserCheck,
  Scale
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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHostname = (hostname: string) => {
    return hostname.replace(/^www\./, '');
  };

  // Normalize score to 0-100 range for display
  const normalizeScore = (score: number) => {
    // If score is already 0-100, use as is
    if (score <= 100) return score;
    // If score is 0-10, multiply by 10
    if (score <= 10) return score * 10;
    return score;
  };

  const displayScore = analysis.overall_score;
  const normalizedScore = normalizeScore(analysis.overall_score);

  const getGradeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'text-green-600 bg-green-50 border-green-200';
      case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'F': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case 'LOW': return 'text-green-700 bg-green-100';
      case 'MODERATE': return 'text-yellow-700 bg-yellow-100';
      case 'MODERATE-HIGH': return 'text-orange-700 bg-orange-100';
      case 'HIGH': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getComplianceStatus = (compliance: string) => {
    switch (compliance?.toUpperCase()) {
      case 'COMPLIANT': return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', text: 'Good' };
      case 'PARTIALLY_COMPLIANT': return { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Okay' };
      case 'NON_COMPLIANT': return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', text: 'Poor' };
      default: return { icon: Info, color: 'text-gray-600', bg: 'bg-gray-50', text: 'Unknown' };
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
    a.download = `privacy-report-${formatHostname(analysis.hostname)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button onClick={downloadReport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{formatHostname(analysis.hostname)}</h1>
            <p className="text-lg text-gray-600">Privacy Policy Analysis</p>
            <p className="text-sm text-gray-500 mt-1">Analyzed on {formatDate(analysis.created_at)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Privacy Overview Summary */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-8">
              {/* Main Score Display - Simple Card Design */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <div className="text-5xl font-bold text-gray-900">
                        {displayScore.toFixed(1)}
                      </div>
                      <div className="text-lg text-gray-600 font-medium">Overall Privacy Score</div>
                    </div>
                    
                    {/* Score Bar */}
                    <div className="max-w-xs mx-auto">
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            normalizedScore >= 80 ? 'bg-green-500' :
                            normalizedScore >= 60 ? 'bg-blue-500' :
                            normalizedScore >= 40 ? 'bg-yellow-500' :
                            normalizedScore >= 20 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(normalizedScore, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>Poor</span>
                        <span>Good</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade and Risk Level - Side by Side */}
              <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-2 ${getGradeColor(analysis.privacy_grade)}`}>
                    {analysis.privacy_grade || 'F'}
                  </div>
                  <h4 className="font-bold text-gray-900 mt-3 mb-1">Privacy Grade</h4>
                  <p className="text-sm text-gray-600">
                    {analysis.privacy_grade === 'A' ? 'Excellent' :
                     analysis.privacy_grade === 'B' ? 'Good' :
                     analysis.privacy_grade === 'C' ? 'Average' :
                     analysis.privacy_grade === 'D' ? 'Poor' :
                     'Very Poor'}
                  </p>
                </div>

                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg ${getRiskColor(analysis.risk_level)}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mt-3 mb-1">Risk Level</h4>
                  <p className="text-sm text-gray-600">
                    {analysis.risk_level?.replace('-', ' ') || 'Unknown'} Risk
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You Should Be Aware Of - NEW SECTION */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Eye className="w-5 h-5" />
              What You Should Be Aware Of
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">Data Monetization</h4>
                  <p className="text-sm text-orange-800">
                    This website may collect and use your personal information for commercial purposes. Your data could be shared with advertisers or sold to third parties.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">Tracking & Surveillance</h4>
                  <p className="text-sm text-orange-800">
                    Your browsing behavior, location, and online activities may be monitored and recorded. This data creates a detailed profile about you.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">Data Security</h4>
                  <p className="text-sm text-orange-800">
                    Consider how well your personal information is protected from hackers, data breaches, and unauthorized access.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">Your Rights</h4>
                  <p className="text-sm text-orange-800">
                    You have legal rights to access, correct, or delete your personal data. Check if this website respects and facilitates these rights.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What This Means for You */}
        {analysis.analysis_data.summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                What This Means for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{analysis.analysis_data.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Important Things to Know */}
        {analysis.analysis_data.key_findings && analysis.analysis_data.key_findings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Important Things to Know
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.analysis_data.key_findings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{finding}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* How to Protect Yourself */}
        {analysis.analysis_data.recommendations && analysis.analysis_data.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
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

        {/* Legal Protection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              How Well Are You Protected?
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              This shows how well the website follows major privacy laws that protect your personal information.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* GDPR */}
              <div className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${getComplianceStatus(analysis.gdpr_compliance).bg} flex items-center justify-center`}>
                      {React.createElement(getComplianceStatus(analysis.gdpr_compliance).icon, {
                        className: `w-4 h-4 ${getComplianceStatus(analysis.gdpr_compliance).color}`
                      })}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">GDPR</h4>
                      <p className="text-xs text-gray-500">European Union • Strongest privacy law globally</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getComplianceStatus(analysis.gdpr_compliance).bg} ${getComplianceStatus(analysis.gdpr_compliance).color}`}>
                    {getComplianceStatus(analysis.gdpr_compliance).text}
                  </div>
                </div>
              </div>

              {/* CCPA */}
              <div className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${getComplianceStatus(analysis.ccpa_compliance).bg} flex items-center justify-center`}>
                      {React.createElement(getComplianceStatus(analysis.ccpa_compliance).icon, {
                        className: `w-4 h-4 ${getComplianceStatus(analysis.ccpa_compliance).color}`
                      })}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">CCPA</h4>
                      <p className="text-xs text-gray-500">California, USA • Consumer privacy rights</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getComplianceStatus(analysis.ccpa_compliance).bg} ${getComplianceStatus(analysis.ccpa_compliance).color}`}>
                    {getComplianceStatus(analysis.ccpa_compliance).text}
                  </div>
                </div>
              </div>

              {/* DPDP Act 2023 */}
              {analysis.dpdp_act_compliance && (
                <div className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${getComplianceStatus(analysis.dpdp_act_compliance).bg} flex items-center justify-center`}>
                        {React.createElement(getComplianceStatus(analysis.dpdp_act_compliance).icon, {
                          className: `w-4 h-4 ${getComplianceStatus(analysis.dpdp_act_compliance).color}`
                        })}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">DPDP Act 2023</h4>
                        <p className="text-xs text-gray-500">India • Digital personal data protection</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getComplianceStatus(analysis.dpdp_act_compliance).bg} ${getComplianceStatus(analysis.dpdp_act_compliance).color}`}>
                      {getComplianceStatus(analysis.dpdp_act_compliance).text}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Website Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-600" />
              Website Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Website:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatHostname(analysis.hostname)}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={analysis.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Analysis Date:</span>
                <span className="font-medium">{formatDate(analysis.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Report ID:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">#{analysis.id}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="text-center pt-8">
          <div className="space-y-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">Analyze Another Website</Link>
            </Button>
            <p className="text-sm text-gray-500">
              Help us improve privacy awareness by sharing this report with others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}