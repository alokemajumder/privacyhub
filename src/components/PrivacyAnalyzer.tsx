'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Search, ExternalLink } from 'lucide-react';

interface AnalysisResult {
  url: string;
  timestamp: string;
  analysis: {
    overall_score: number;
    categories: {
      [key: string]: {
        score: number;
        reasoning: string;
      };
    };
    key_concerns: string[];
    positive_aspects: string[];
    recommendations: string[];
    privacy_grade: string;
    summary: string;
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

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'text-green-600 bg-green-50';
    if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-600 bg-blue-50';
    if (['C+', 'C', 'C-'].includes(grade)) return 'text-yellow-600 bg-yellow-50';
    if (['D+', 'D', 'D-'].includes(grade)) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
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
                className="px-6"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-background mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
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
          {/* Overall Score */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Privacy Analysis Results</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground">for</span>
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {new URL(result.url).hostname}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`text-2xl px-4 py-2 ${getGradeColor(result.analysis.privacy_grade)}`}>
                    {result.analysis.privacy_grade}
                  </Badge>
                  <div className={`text-2xl font-bold mt-1 ${getScoreColor(result.analysis.overall_score)}`}>
                    {result.analysis.overall_score}/10
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">
                {result.analysis.summary}
              </p>
              
              <Progress 
                value={result.analysis.overall_score * 10} 
                className="w-full h-3"
              />
            </CardContent>
          </Card>

          {/* Category Scores */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4">Detailed Analysis</h4>
              <div className="grid gap-4">
                {Object.entries(result.analysis.categories).map(([key, category]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <span className={`font-semibold ${getScoreColor(category.score)}`}>
                        {category.score}/10
                      </span>
                    </div>
                    <Progress value={category.score * 10} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {category.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Findings */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Concerns */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h4 className="font-semibold">Key Concerns</h4>
                </div>
                <ul className="space-y-2">
                  {result.analysis.key_concerns.map((concern, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      {concern}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Positive Aspects */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold">Positive Aspects</h4>
                </div>
                <ul className="space-y-2">
                  {result.analysis.positive_aspects.map((aspect, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {aspect}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold">Recommendations</h4>
                </div>
                <ul className="space-y-2">
                  {result.analysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

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