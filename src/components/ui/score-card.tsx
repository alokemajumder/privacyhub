'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScoreCardProps {
  title: string;
  score: number; // 0-10
  maxScore?: number;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  className?: string;
}

export function ScoreCard({ 
  title, 
  score, 
  maxScore = 10, 
  description, 
  trend,
  icon,
  className = '' 
}: ScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    if (score >= 2) return 'text-orange-600';
    return 'text-red-600';
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-50 border-green-200';
    if (score >= 6) return 'bg-blue-50 border-blue-200';
    if (score >= 4) return 'bg-yellow-50 border-yellow-200';
    if (score >= 2) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };
  
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↗</span>;
      case 'down':
        return <span className="text-red-500">↘</span>;
      case 'stable':
        return <span className="text-gray-500">→</span>;
      default:
        return null;
    }
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Exemplary';
    if (score >= 8) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Fair';
    if (score >= 4) return 'Poor';
    return 'Critical';
  };
  
  return (
    <Card className={`border-2 ${getScoreBg(score)} ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 rounded-lg bg-white/50">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score.toFixed(1)}
                </span>
                <span className="text-lg text-gray-400">/{maxScore}</span>
                {trend && (
                  <span className="text-lg">{getTrendIcon(trend)}</span>
                )}
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className={getScoreColor(score)}>
            {getScoreLabel(score)}
          </Badge>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Score Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                score >= 8 ? 'bg-green-500' :
                score >= 6 ? 'bg-blue-500' :
                score >= 4 ? 'bg-yellow-500' :
                score >= 2 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        
        {description && (
          <p className="text-xs text-gray-600 mt-3">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}