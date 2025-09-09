'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Heatmap } from '@/components/ui/heatmap';
import { ScoreCard } from '@/components/ui/score-card';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  FileText, 
  Scale,
  Zap,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BarChart3,
  Timer,
  Globe
} from 'lucide-react';

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

interface LoadingStep {
  step: string;
  status: 'pending' | 'active' | 'completed';
}

export default function PrivacyAnalyzerNew() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
    { step: 'Crawling website...', status: 'pending' },
    { step: 'Extracting privacy policy...', status: 'pending' },
    { step: 'AI analysis in progress...', status: 'pending' },
    { step: 'Calculating compliance scores...', status: 'pending' },
    { step: 'Generating recommendations...', status: 'pending' }
  ]);

  const simulateProgress = useCallback(() => {
    const steps = [...loadingSteps];
    let stepIndex = 0;
    
    const progressInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        steps[stepIndex].status = 'active';
        setLoadingSteps([...steps]);
        
        setTimeout(() => {
          if (stepIndex < steps.length) {
            steps[stepIndex].status = 'completed';
            setLoadingSteps([...steps]);
            stepIndex++;
          }
        }, Math.random() * 3000 + 2000); // 2-5 seconds per step
      } else {
        clearInterval(progressInterval);
      }
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, [loadingSteps]);

  const analyzePolicy = async () => {
    if (!url.trim()) {
      setError('Please enter a valid website URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setLoadingSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));

    const cleanup = simulateProgress();

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
      cleanup();
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(errorMessage);
    } finally {
      cleanup();
      setLoading(false);
      setLoadingSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
    }
  };

  // Memoized color functions for better performance
  const colorHelpers = useMemo(() => ({
    getGradeColor: (grade: string) => {
      if (['A+', 'A', 'A-'].includes(grade)) return 'from-emerald-500 to-green-500 text-white';
      if (['B+', 'B', 'B-'].includes(grade)) return 'from-blue-500 to-indigo-500 text-white';
      if (['C+', 'C', 'C-'].includes(grade)) return 'from-yellow-500 to-amber-500 text-white';
      if (['D+', 'D', 'D-'].includes(grade)) return 'from-orange-500 to-red-500 text-white';
      return 'from-red-600 to-red-700 text-white';
    },
    
    getRiskLevelColor: (riskLevel: string) => {
      switch (riskLevel) {
        case 'EXEMPLARY': return 'from-emerald-50 to-green-50 border-emerald-200 text-emerald-800';
        case 'LOW': return 'from-green-50 to-emerald-50 border-green-200 text-green-800';
        case 'MODERATE': return 'from-yellow-50 to-amber-50 border-yellow-200 text-yellow-800';
        case 'MODERATE-HIGH': return 'from-orange-50 to-red-50 border-orange-200 text-orange-800';
        case 'HIGH': return 'from-red-50 to-rose-50 border-red-200 text-red-800';
        default: return 'from-gray-50 to-slate-50 border-gray-200 text-gray-800';
      }
    },
    
    getComplianceColor: (status: string) => {
      switch (status) {
        case 'COMPLIANT': return 'from-green-50 to-emerald-50 text-green-700 border-green-200';
        case 'PARTIALLY_COMPLIANT': return 'from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200';
        case 'NON_COMPLIANT': return 'from-red-50 to-rose-50 text-red-700 border-red-200';
        case 'NOT_APPLICABLE': return 'from-gray-50 to-slate-50 text-gray-700 border-gray-200';
        default: return 'from-gray-50 to-slate-50 text-gray-700 border-gray-200';
      }
    },
    
    getScoreColor: (score: number) => {
      if (score >= 8) return 'text-emerald-600';
      if (score >= 6) return 'text-blue-600';
      if (score >= 4) return 'text-amber-600';
      return 'text-red-600';
    }
  }), []);

  const categoryIcons = useMemo(() => ({
    'data_collection': Shield,
    'data_sharing': Users,
    'user_rights': Scale,
    'security_measures': Lock,
    'compliance_framework': FileText,
    'transparency': Eye
  }), []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Modern Search Interface */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <CardContent className="relative p-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-blue-700 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                AI-Powered Privacy Analysis
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Analyze Any Privacy Policy
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get instant insights into how websites handle your personal data with our comprehensive 
                AI-powered privacy assessment
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity blur" />
                <Input
                  type="url"
                  placeholder="Enter website URL (e.g., https://example.com/privacy)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && analyzePolicy()}
                  disabled={loading}
                  className="relative text-base h-14 border-2 border-gray-200 focus:border-blue-500 rounded-lg bg-white/80 backdrop-blur transition-all duration-200"
                />
                <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Button
                onClick={analyzePolicy}
                disabled={loading || !url.trim()}
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Analyze Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg max-w-2xl mx-auto">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Loading State */}
      {loading && (
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Privacy Policy</h3>
                <p className="text-gray-600">Our AI is carefully reviewing the privacy policy...</p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {loadingSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                      step.status === 'completed' 
                        ? 'bg-green-50 border border-green-200' 
                        : step.status === 'active'
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step.status === 'completed'
                        ? 'bg-green-500'
                        : step.status === 'active'
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : step.status === 'active' ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Timer className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className={`font-medium transition-colors duration-300 ${
                      step.status === 'completed' 
                        ? 'text-green-800' 
                        : step.status === 'active'
                        ? 'text-blue-800'
                        : 'text-gray-600'
                    }`}>
                      {step.step}
                    </span>
                    {step.status === 'active' && (
                      <div className="ml-auto">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Estimated Time */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  Estimated time: 30-60 seconds • Processing with advanced AI models
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Results Display */}
      {result && (
        <div className="space-y-8">
          {/* Hero Results Card */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />
            <CardContent className="relative p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-700 text-sm font-medium mb-4">
                  <CheckCircle2 className="h-4 w-4" />
                  Analysis Complete
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Privacy Analysis Results</h2>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <span>Analysis for</span>
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                  >
                    {new URL(result.url).hostname}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Main Score Display */}
              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Overall Score */}
                <div className="lg:col-span-1 flex flex-col items-center justify-center">
                  <div className="relative">
                    <CircularProgress 
                      value={result.analysis.overall_score * 10} 
                      size={180}
                      strokeWidth={14}
                      showValue={false}
                      color={result.analysis.overall_score >= 8 ? '#10b981' : result.analysis.overall_score >= 6 ? '#3b82f6' : result.analysis.overall_score >= 4 ? '#f59e0b' : '#ef4444'}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-5xl font-bold ${colorHelpers.getScoreColor(result.analysis.overall_score)}`}>
                        {result.analysis.overall_score.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">Privacy Score</div>
                    </div>
                  </div>
                </div>

                {/* Grade and Risk */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Privacy Grade</div>
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${colorHelpers.getGradeColor(result.analysis.privacy_grade)} shadow-lg`}>
                      <span className="text-3xl font-bold">{result.analysis.privacy_grade}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-3">Risk Level</div>
                    <Badge className={`px-4 py-2 text-sm font-semibold border-2 bg-gradient-to-r ${colorHelpers.getRiskLevelColor(result.analysis.risk_level)}`}>
                      {result.analysis.risk_level.replace('-', ' ')} RISK
                    </Badge>
                  </div>
                </div>

                {/* Compliance Status */}
                <div className="lg:col-span-1 space-y-4">
                  <div className={`p-4 rounded-xl border-2 bg-gradient-to-r ${colorHelpers.getComplianceColor(result.analysis.regulatory_compliance.gdpr_compliance)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="h-5 w-5" />
                        <span className="font-semibold">GDPR</span>
                      </div>
                      <Badge variant="secondary" className="bg-white/80">
                        {result.analysis.regulatory_compliance.gdpr_compliance.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  {result.analysis.regulatory_compliance.ccpa_compliance !== 'NOT_APPLICABLE' && (
                    <div className={`p-4 rounded-xl border-2 bg-gradient-to-r ${colorHelpers.getComplianceColor(result.analysis.regulatory_compliance.ccpa_compliance)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          <span className="font-semibold">CCPA</span>
                        </div>
                        <Badge variant="secondary" className="bg-white/80">
                          {result.analysis.regulatory_compliance.ccpa_compliance.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Executive Summary */}
              <Card className="border-0 bg-white/70 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Executive Summary</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {result.analysis.executive_summary}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Category Analysis */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Score Cards */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold">Category Breakdown</h3>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(result.analysis.categories).map(([key, category]) => {
                    const IconComponent = categoryIcons[key as keyof typeof categoryIcons] || Shield;
                    
                    return (
                      <div key={key} className="group">
                        <ScoreCard
                          title={key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          score={category.score}
                          description={category.reasoning}
                          icon={<IconComponent className="h-5 w-5" />}
                          className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-0 bg-gradient-to-r from-gray-50 to-slate-50"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Visual Heatmap */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-rose-600" />
                  </div>
                  <h3 className="text-xl font-bold">Score Visualization</h3>
                </div>
                
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
                  className="mb-6"
                />
                
                {/* Regulatory Notes */}
                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Compliance Insights
                  </h5>
                  {Object.entries(result.analysis.categories).map(([key, category]) => (
                    category.regulatory_notes && (
                      <div key={key} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                        <p className="text-sm text-blue-800">
                          <strong className="text-blue-900">{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {category.regulatory_notes}
                        </p>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Findings */}
          {result.analysis.critical_findings && (
            <Card className="border-0 bg-gradient-to-r from-red-50 to-rose-50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-red-800">Critical Privacy Issues</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {result.analysis.critical_findings.high_risk_practices?.length > 0 && (
                    <div className="bg-white/70 backdrop-blur rounded-xl p-4">
                      <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        High Risk Practices
                      </h5>
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
                  
                  {result.analysis.critical_findings.regulatory_gaps?.length > 0 && (
                    <div className="bg-white/70 backdrop-blur rounded-xl p-4">
                      <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <Scale className="h-4 w-4" />
                        Regulatory Gaps
                      </h5>
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
                  
                  {result.analysis.critical_findings.data_subject_impacts?.length > 0 && (
                    <div className="bg-white/70 backdrop-blur rounded-xl p-4">
                      <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        User Impact
                      </h5>
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
            <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Privacy-Protective Practices</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.analysis.positive_practices.map((practice, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white/70 backdrop-blur rounded-lg p-4">
                      <div className="p-1 bg-green-100 rounded-full flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm text-green-800 font-medium">{practice}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Recommendations */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg">
                  <Sparkles className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold">Actionable Recommendations</h3>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Immediate Actions */}
                {result.analysis.actionable_recommendations?.immediate_actions?.length > 0 && (
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-l-4 border-red-400">
                    <h4 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      🚨 Immediate Actions
                    </h4>
                    <ul className="space-y-3">
                      {result.analysis.actionable_recommendations.immediate_actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-red-600 font-bold text-xs">{index + 1}</span>
                          </div>
                          <span className="text-sm text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Medium Term */}
                {result.analysis.actionable_recommendations?.medium_term_improvements?.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-l-4 border-yellow-400">
                    <h4 className="font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      ⏳ Medium Term
                    </h4>
                    <ul className="space-y-3">
                      {result.analysis.actionable_recommendations.medium_term_improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-yellow-600 font-bold text-xs">{index + 1}</span>
                          </div>
                          <span className="text-sm text-gray-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Best Practices */}
                {result.analysis.actionable_recommendations?.best_practice_adoption?.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      ✨ Best Practices
                    </h4>
                    <ul className="space-y-3">
                      {result.analysis.actionable_recommendations.best_practice_adoption.map((practice, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 font-bold text-xs">{index + 1}</span>
                          </div>
                          <span className="text-sm text-gray-700">{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Metadata */}
          <Card className="border-0 bg-gradient-to-r from-gray-50 to-slate-50">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  <span>
                    Analysis completed on {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-white/80">
                    <Zap className="h-3 w-3 mr-1" />
                    AI-Powered Analysis
                  </Badge>
                  <Badge variant="outline" className="bg-white/80">
                    <Shield className="h-3 w-3 mr-1" />
                    GDPR/CCPA Compliant
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}