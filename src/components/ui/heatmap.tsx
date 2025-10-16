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
      <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Score Range</div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
            <div className="w-4 h-4 bg-red-500 rounded-sm flex-shrink-0"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900">1-2</span>
              <span className="text-[10px] text-gray-600">High Risk</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
            <div className="w-4 h-4 bg-orange-500 rounded-sm flex-shrink-0"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900">3-4</span>
              <span className="text-[10px] text-gray-600">Mod-High</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
            <div className="w-4 h-4 bg-yellow-500 rounded-sm flex-shrink-0"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900">5-6</span>
              <span className="text-[10px] text-gray-600">Moderate</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
            <div className="w-4 h-4 bg-blue-500 rounded-sm flex-shrink-0"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900">7-8</span>
              <span className="text-[10px] text-gray-600">Low Risk</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
            <div className="w-4 h-4 bg-green-500 rounded-sm flex-shrink-0"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900">9-10</span>
              <span className="text-[10px] text-gray-600">Exemplary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}