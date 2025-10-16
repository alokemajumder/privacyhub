'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CircularProgress } from '@/components/ui/circular-progress';
import { ScoreGauge } from '@/components/ui/score-gauge';
import { Heatmap } from '@/components/ui/heatmap';
import { ScoreCard } from '@/components/ui/score-card';
import { MethodologySection } from '@/components/MethodologySection';
import { AlertCircle, CheckCircle, Search, ExternalLink, Shield, Lock, Eye, Users, FileText, Scale, Home, RotateCcw } from 'lucide-react';

interface AnalysisResult {
  url: string;
  timestamp: string;
  analysis: {
    overall_score: number;
    risk_level: string;
    regulatory_compliance: {
      gdpr_compliance: string;
      ccpa_compliance: string;
      major_violations: string[];
    };
    categories: {
      [key: string]: {
        score: number;
        reasoning: string;
        regulatory_notes?: string;
      };
    };
    critical_findings: {
      high_risk_practices: string[];
      regulatory_gaps: string[];
      data_subject_impacts: string[];
    };
    positive_practices: string[];
    actionable_recommendations: {
      immediate_actions: string[];
      medium_term_improvements: string[];
      best_practice_adoption: string[];
    };
    privacy_grade: string;
    executive_summary: string;
  };
}

export default function PrivacyAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const analyzePolicy = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setUrl('');
    setResult(null);
    setError('');
    setLoading(false);
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'text-green-600 bg-green-50';
    if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-600 bg-blue-50';
    if (['C+', 'C', 'C-'].includes(grade)) return 'text-yellow-600 bg-yellow-50';
    if (['D+', 'D', 'D-'].includes(grade)) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'EXEMPLARY': return 'text-green-700 bg-green-100 border-green-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'MODERATE-HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'text-green-600 bg-green-50';
      case 'PARTIALLY_COMPLIANT': return 'text-yellow-600 bg-yellow-50';
      case 'NON_COMPLIANT': return 'text-red-600 bg-red-50';
      case 'NOT_APPLICABLE': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Interface */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Analyze Privacy Policy
              </h2>
              <p className="text-muted-foreground">
                Enter a website URL to get detailed privacy policy analysis and scoring
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://example.com/privacy"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && analyzePolicy()}
                  disabled={loading}
                  className="text-base"
                />
              </div>
              <Button
                onClick={analyzePolicy}
                disabled={loading || !url.trim()}
                className="px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
              {(url || result) && (
                <Button
                  onClick={resetAnalysis}
                  disabled={loading}
                  variant="outline"
                  className="px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white border-0"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Analyzing Privacy Policy...</h3>
                <p className="text-muted-foreground">This may take 30-60 seconds</p>
              </div>
              <Progress value={undefined} className="w-full max-w-xs mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Score Dashboard */}
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2">
            <CardContent className="p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1" />
                  <h3 className="text-2xl font-bold text-foreground">Privacy Analysis Results</h3>
                  <div className="flex-1 flex justify-end">
                    <Button
                      onClick={() => window.location.href = '/'}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Home
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground">Analysis for</span>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    {new URL(result.url).hostname}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Main Score Visualization */}
              <div className="grid md:grid-cols-3 gap-8 mb-8 min-h-[220px]">
                {/* Circular Progress */}
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-[160px] h-[160px]">
                    <CircularProgress
                      value={result.analysis.overall_score * 10}
                      size={160}
                      strokeWidth={12}
                      showValue={false}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-4xl font-bold ${getScoreColor(result.analysis.overall_score)}`}>
                        {result.analysis.overall_score.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">/ 10</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-3 font-medium">Overall Score</div>
                </div>

                {/* Score Gauge */}
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-full flex justify-center">
                    <ScoreGauge
                      score={result.analysis.overall_score}
                      size="lg"
                      label="Privacy Protection Level"
                    />
                  </div>
                </div>

                {/* Grade and Risk Level */}
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <div className="text-center">
                    <Badge className={`text-3xl px-6 py-3 ${getGradeColor(result.analysis.privacy_grade)}`}>
                      {result.analysis.privacy_grade}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-2">Privacy Grade</div>
                  </div>

                  <div className="text-center">
                    <Badge className={`px-4 py-2 border-2 ${getRiskLevelColor(result.analysis.risk_level)}`}>
                      {result.analysis.risk_level.replace('-', ' ')} RISK
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Executive Summary */}
              <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Executive Summary
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {result.analysis.executive_summary}
                </p>
              </div>
              
              {/* Compliance Status */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">GDPR Compliance</span>
                    </div>
                    <Badge className={`px-3 py-1 ${getComplianceColor(result.analysis.regulatory_compliance.gdpr_compliance)}`}>
                      {result.analysis.regulatory_compliance.gdpr_compliance.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                {result.analysis.regulatory_compliance.ccpa_compliance !== 'NOT_APPLICABLE' && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">CCPA Compliance</span>
                      </div>
                      <Badge className={`px-3 py-1 ${getComplianceColor(result.analysis.regulatory_compliance.ccpa_compliance)}`}>
                        {result.analysis.regulatory_compliance.ccpa_compliance.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Scores Dashboard */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Score Cards Grid */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Category Analysis
                </h4>
                
                <div className="grid gap-4">
                  {Object.entries(result.analysis.categories).map(([key, category]) => {
                    const getIcon = (categoryKey: string) => {
                      switch (categoryKey) {
                        case 'data_collection': return <Shield className="h-5 w-5" />;
                        case 'data_sharing': return <Users className="h-5 w-5" />;
                        case 'user_rights': return <Scale className="h-5 w-5" />;
                        case 'security_measures': return <Lock className="h-5 w-5" />;
                        case 'compliance_framework': return <FileText className="h-5 w-5" />;
                        case 'transparency': return <Eye className="h-5 w-5" />;
                        default: return <Shield className="h-5 w-5" />;
                      }
                    };
                    
                    return (
                      <ScoreCard
                        key={key}
                        title={key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        score={category.score}
                        description={category.reasoning}
                        icon={getIcon(key)}
                        className="hover:shadow-md transition-all duration-200"
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Heatmap Visualization */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <Heatmap
                    data={Object.entries(result.analysis.categories).map(([key, category]) => {
                      const weights: Record<string, number> = {
                        'data_collection': 30,
                        'data_sharing': 25,
                        'user_rights': 20,
                        'security_measures': 15,
                        'compliance_framework': 7,
                        'transparency': 3
                      };
                      
                      return {
                        label: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        value: category.score,
                        weight: weights[key] || 10
                      };
                    })}
                  />
                  
                  {/* Regulatory Notes */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-gray-700">Regulatory Compliance Notes</h5>
                    {Object.entries(result.analysis.categories).map(([key, category]) => (
                      category.regulatory_notes && (
                        <div key={key} className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {category.regulatory_notes}
                          </p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Findings */}
          {result.analysis.critical_findings && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <h4 className="text-lg font-semibold text-red-800">Critical Findings</h4>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* High Risk Practices */}
                  {result.analysis.critical_findings.high_risk_practices?.length > 0 && (
                    <div>
                      <h5 className="font-medium text-red-700 mb-2">High Risk Practices</h5>
                      <ul className="space-y-2">
                        {result.analysis.critical_findings.high_risk_practices.map((practice, index) => (
                          <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Regulatory Gaps */}
                  {result.analysis.critical_findings.regulatory_gaps?.length > 0 && (
                    <div>
                      <h5 className="font-medium text-red-700 mb-2">Regulatory Gaps</h5>
                      <ul className="space-y-2">
                        {result.analysis.critical_findings.regulatory_gaps.map((gap, index) => (
                          <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Data Subject Impacts */}
                  {result.analysis.critical_findings.data_subject_impacts?.length > 0 && (
                    <div>
                      <h5 className="font-medium text-red-700 mb-2">User Impact</h5>
                      <ul className="space-y-2">
                        {result.analysis.critical_findings.data_subject_impacts.map((impact, index) => (
                          <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Positive Practices */}
          {result.analysis.positive_practices?.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h4 className="text-lg font-semibold text-green-800">Privacy-Protective Practices</h4>
                </div>
                <ul className="space-y-2">
                  {result.analysis.positive_practices.map((practice, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                      {practice}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Actionable Recommendations */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Search className="h-6 w-6 text-blue-600" />
                <h4 className="text-lg font-semibold">Actionable Recommendations</h4>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Immediate Actions */}
                {result.analysis.actionable_recommendations?.immediate_actions?.length > 0 && (
                  <div className="border-l-4 border-red-400 pl-4">
                    <h5 className="font-medium text-red-700 mb-3">🚨 Immediate Actions</h5>
                    <ul className="space-y-2">
                      {result.analysis.actionable_recommendations.immediate_actions.map((action, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Medium Term */}
                {result.analysis.actionable_recommendations?.medium_term_improvements?.length > 0 && (
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h5 className="font-medium text-yellow-700 mb-3">⏳ Medium Term</h5>
                    <ul className="space-y-2">
                      {result.analysis.actionable_recommendations.medium_term_improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Best Practices */}
                {result.analysis.actionable_recommendations?.best_practice_adoption?.length > 0 && (
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h5 className="font-medium text-blue-700 mb-3">✨ Best Practices</h5>
                    <ul className="space-y-2">
                      {result.analysis.actionable_recommendations.best_practice_adoption.map((practice, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {practice}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Methodology Section */}
          <MethodologySection />

          {/* Analysis Metadata */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Analysis completed on {new Date(result.timestamp).toLocaleString()}
                </span>
                <Badge variant="outline">
                  AI-Powered Analysis
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}