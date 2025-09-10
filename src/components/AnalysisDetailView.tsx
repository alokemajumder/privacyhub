'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
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
  Scale,
  HelpCircle
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


  const displayScore = analysis.overall_score;

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
            <div className="space-y-6">
              {/* Main Score Display - Simple Large Text */}
              <div className="text-center">
                <div className="text-7xl font-bold text-gray-900 mb-2">
                  {displayScore.toFixed(1)}
                  <span className="text-4xl text-gray-500 font-normal">/10</span>
                </div>
                <div className="text-xl text-gray-600">Overall Privacy Score</div>
              </div>

              {/* Progress Bar for Score */}
              <div className="max-w-md mx-auto">
                <Progress value={displayScore * 10} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Grade and Risk Level Badges */}
              <div className="flex justify-center gap-4 flex-wrap">
                <HoverCard>
                  <HoverCardTrigger>
                    <Badge variant="outline" className="px-4 py-2 text-lg font-bold cursor-help">
                      Grade: {analysis.privacy_grade || 'F'}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Privacy Grade Explained</h4>
                      <p className="text-sm text-gray-600">
                        {analysis.privacy_grade === 'A' ? 'Excellent privacy practices with strong user protections.' :
                         analysis.privacy_grade === 'B' ? 'Good privacy practices with minor concerns.' :
                         analysis.privacy_grade === 'C' ? 'Average privacy practices with some issues.' :
                         analysis.privacy_grade === 'D' ? 'Poor privacy practices with significant concerns.' :
                         'Very poor privacy practices. Use with caution.'}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <Badge 
                  variant={analysis.risk_level?.includes('LOW') ? 'default' : 
                          analysis.risk_level?.includes('MODERATE') ? 'secondary' : 
                          'destructive'}
                  className="px-4 py-2 text-lg font-bold"
                >
                  {analysis.risk_level?.replace('_', ' ').replace('-', ' ') || 'Unknown'} Risk
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You Should Be Aware Of - Using Alert Component */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Privacy Considerations</AlertTitle>
          <AlertDescription className="mt-4 space-y-4">
            <div className="space-y-3">
              <HoverCard>
                <HoverCardTrigger className="flex items-start gap-2 cursor-help">
                  <Badge variant="outline" className="mt-0.5">Data Use</Badge>
                  <p className="text-sm">Your personal data may be monetized through advertising or third-party sharing.</p>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Data Monetization Details
                    </h4>
                    <p className="text-sm text-gray-600">
                      Many websites generate revenue by collecting user data and sharing it with advertisers, data brokers, and marketing companies. This can include your browsing habits, interests, and personal preferences.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger className="flex items-start gap-2 cursor-help">
                  <Badge variant="outline" className="mt-0.5">Tracking</Badge>
                  <p className="text-sm">Your online activities and location may be continuously monitored.</p>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Tracking & Surveillance
                    </h4>
                    <p className="text-sm text-gray-600">
                      Websites use various technologies like cookies, pixels, and fingerprinting to track your behavior across the internet, building detailed profiles about your interests and activities.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger className="flex items-start gap-2 cursor-help">
                  <Badge variant="outline" className="mt-0.5">Security</Badge>
                  <p className="text-sm">Check how your data is protected from breaches and unauthorized access.</p>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Data Security Measures
                    </h4>
                    <p className="text-sm text-gray-600">
                      Look for information about encryption, secure storage, access controls, and breach notification procedures to understand how well your data is protected.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger className="flex items-start gap-2 cursor-help">
                  <Badge variant="outline" className="mt-0.5">Rights</Badge>
                  <p className="text-sm">You have legal rights to control your personal data.</p>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Your Privacy Rights
                    </h4>
                    <p className="text-sm text-gray-600">
                      Under laws like GDPR and CCPA, you have rights to access, correct, delete, and port your data. You can also opt-out of certain data processing activities.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </AlertDescription>
        </Alert>

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

        {/* Legal Protection Status with Hover Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              Regulatory Compliance
              <HoverCard>
                <HoverCardTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Privacy Law Compliance</h4>
                    <p className="text-sm text-gray-600">
                      These indicators show how well the website complies with major privacy regulations that protect your personal data rights.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* GDPR with HoverCard */}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-help hover:shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {React.createElement(getComplianceStatus(analysis.gdpr_compliance).icon, {
                          className: `w-5 h-5 ${getComplianceStatus(analysis.gdpr_compliance).color}`
                        })}
                        <div>
                          <h4 className="font-medium text-gray-900">GDPR</h4>
                          <p className="text-xs text-gray-500">European Privacy Regulation</p>
                        </div>
                      </div>
                      <Badge 
                        variant={analysis.gdpr_compliance === 'COMPLIANT' ? 'default' : 
                                analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'secondary' : 
                                'destructive'}
                      >
                        {getComplianceStatus(analysis.gdpr_compliance).text}
                      </Badge>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">General Data Protection Regulation</h4>
                    <p className="text-sm text-gray-600">
                      The GDPR is the world&apos;s strongest privacy law, giving EU citizens rights to access, correct, delete, and port their data. It requires explicit consent for data processing.
                    </p>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        Status: {analysis.gdpr_compliance?.replace('_', ' ') || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {/* CCPA with HoverCard */}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-help hover:shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {React.createElement(getComplianceStatus(analysis.ccpa_compliance).icon, {
                          className: `w-5 h-5 ${getComplianceStatus(analysis.ccpa_compliance).color}`
                        })}
                        <div>
                          <h4 className="font-medium text-gray-900">CCPA</h4>
                          <p className="text-xs text-gray-500">California Privacy Act</p>
                        </div>
                      </div>
                      <Badge 
                        variant={analysis.ccpa_compliance === 'COMPLIANT' ? 'default' : 
                                analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'secondary' : 
                                'destructive'}
                      >
                        {getComplianceStatus(analysis.ccpa_compliance).text}
                      </Badge>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">California Consumer Privacy Act</h4>
                    <p className="text-sm text-gray-600">
                      The CCPA gives California residents the right to know what personal information is collected, the right to delete it, and the right to opt-out of its sale.
                    </p>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        Status: {analysis.ccpa_compliance?.replace('_', ' ') || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {/* DPDP Act 2023 with HoverCard */}
              {analysis.dpdp_act_compliance && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-help hover:shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {React.createElement(getComplianceStatus(analysis.dpdp_act_compliance).icon, {
                            className: `w-5 h-5 ${getComplianceStatus(analysis.dpdp_act_compliance).color}`
                          })}
                          <div>
                            <h4 className="font-medium text-gray-900">DPDP Act 2023</h4>
                            <p className="text-xs text-gray-500">Indian Data Protection Law</p>
                          </div>
                        </div>
                        <Badge 
                          variant={analysis.dpdp_act_compliance === 'COMPLIANT' ? 'default' : 
                                  analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? 'secondary' : 
                                  'destructive'}
                        >
                          {getComplianceStatus(analysis.dpdp_act_compliance).text}
                        </Badge>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Digital Personal Data Protection Act 2023</h4>
                      <p className="text-sm text-gray-600">
                        India&apos;s comprehensive data protection law that governs the processing of digital personal data, giving individuals rights over their personal information.
                      </p>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          Status: {analysis.dpdp_act_compliance?.replace('_', ' ') || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
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

        {/* Important Disclaimer */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Disclaimer</AlertTitle>
          <AlertDescription className="mt-2 space-y-2 text-sm">
            <p>
              <strong>Educational Purpose Only:</strong> This analysis and score is based on our proprietary methodology 
              and is intended for education and privacy awareness purposes only.
            </p>
            <p>
              <strong>Potential Limitations:</strong> The analysis may contain errors, omissions, or inaccuracies. 
              Privacy policies can change frequently, and our analysis reflects the policy at the time of review.
            </p>
            <p>
              <strong>Not Legal Advice:</strong> This report should not be used as the sole basis for legal, 
              business, or financial decisions. Always consult qualified professionals for specific advice.
            </p>
            <p>
              <strong>Independent Verification:</strong> We recommend reviewing the actual privacy policy 
              and consulting with privacy experts for critical assessments.
            </p>
          </AlertDescription>
        </Alert>

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