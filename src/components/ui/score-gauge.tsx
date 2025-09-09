'use client';

import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0-10
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ScoreGauge({ score, label, size = 'md', showLabel = true }: ScoreGaugeProps) {
  const percentage = (score / 10) * 100;
  
  const sizes = {
    sm: { width: 200, height: 120, strokeWidth: 12, fontSize: 'text-lg' },
    md: { width: 240, height: 140, strokeWidth: 16, fontSize: 'text-xl' },
    lg: { width: 280, height: 160, strokeWidth: 20, fontSize: 'text-2xl' },
  };
  
  const { width, height, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth * 2) / 2;
  const centerX = width / 2;
  const centerY = height - 20;
  
  const startAngle = Math.PI; // Start at 180 degrees (left)
  const endAngle = 0; // End at 0 degrees (right)
  const angle = startAngle + (endAngle - startAngle) * (percentage / 100);
  
  // Calculate arc path
  const x1 = centerX - radius * Math.cos(startAngle);
  const y1 = centerY - radius * Math.sin(startAngle);
  const x2 = centerX - radius * Math.cos(endAngle);
  const y2 = centerY - radius * Math.sin(endAngle);
  
  const backgroundPath = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  
  // Progress arc
  const progressX = centerX - radius * Math.cos(angle);
  const progressY = centerY - radius * Math.sin(angle);
  const largeArcFlag = percentage > 50 ? 1 : 0;
  const progressPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${progressX} ${progressY}`;
  
  // Color based on score
  const getColor = (score: number) => {
    if (score >= 8) return '#10b981'; // green
    if (score >= 6) return '#3b82f6'; // blue  
    if (score >= 4) return '#f59e0b'; // yellow
    if (score >= 2) return '#f97316'; // orange
    return '#ef4444'; // red
  };
  
  const color = getColor(score);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Background arc */}
          <path
            d={backgroundPath}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={progressPath}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Score text */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            className={`${fontSize} font-bold fill-gray-900`}
          >
            {score.toFixed(1)}
          </text>
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            className="text-sm fill-gray-500"
          >
            / 10
          </text>
        </svg>
      </div>
      {showLabel && label && (
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-700">{label}</p>
        </div>
      )}
    </div>
  );
}