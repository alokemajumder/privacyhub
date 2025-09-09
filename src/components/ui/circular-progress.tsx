'use client';

import React from 'react';

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  color?: string;
}

export function CircularProgress({ 
  value, 
  size = 120, 
  strokeWidth = 8, 
  className = '',
  showValue = true,
  color = '#3b82f6' 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getColorByValue = (val: number) => {
    if (val >= 80) return '#10b981'; // green
    if (val >= 60) return '#3b82f6'; // blue
    if (val >= 40) return '#f59e0b'; // yellow
    if (val >= 20) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const circleColor = color === '#3b82f6' ? getColorByValue(value) : color;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={circleColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(value)}
          </span>
        </div>
      )}
    </div>
  );
}