'use client';

import React from 'react';

interface HeatmapData {
  label: string;
  value: number; // 0-10
  weight: number; // percentage weight
}

interface HeatmapProps {
  data: HeatmapData[];
  className?: string;
}

export function Heatmap({ data, className = '' }: HeatmapProps) {
  const getIntensityColor = (value: number) => {
    // Normalize value to 0-1 range
    const intensity = value / 10;
    
    if (intensity >= 0.8) return 'bg-green-500';
    if (intensity >= 0.6) return 'bg-blue-500';
    if (intensity >= 0.4) return 'bg-yellow-500';
    if (intensity >= 0.2) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getOpacity = (value: number) => {
    const intensity = value / 10;
    return Math.max(0.2, intensity); // Minimum 20% opacity
  };
  
  // Sort by weight (importance) for better visualization
  const sortedData = [...data].sort((a, b) => b.weight - a.weight);
  
  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-700 mb-4">Privacy Score Heatmap</h4>
      <div className="grid gap-2">
        {sortedData.map((item, index) => (
          <div
            key={index}
            className="relative flex items-center justify-between p-3 rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Background intensity bar */}
            <div
              className={`absolute inset-0 ${getIntensityColor(item.value)}`}
              style={{ opacity: getOpacity(item.value) }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900">
                  {item.label}
                </div>
                <div className="text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
                  {item.weight}% weight
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold text-gray-900">
                  {item.value.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">/10</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs font-medium text-gray-600 mb-2">Score Range</div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>1-2 High Risk</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>3-4 Moderate-High</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>5-6 Moderate</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>7-8 Low Risk</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>9-10 Exemplary</span>
          </div>
        </div>
      </div>
    </div>
  );
}