import React from 'react';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  size: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size }) => {
  // Calculate the color based on the score
  const getColor = () => {
    if (score < 30) return '#EF4444'; // red
    if (score < 50) return '#F59E0B'; // yellow-orange
    if (score < 70) return '#F59E0B'; // yellow
    if (score < 90) return '#10B981'; // green
    return '#10B981'; // green
  };
  
  // Calculate the stroke width based on the size
  const strokeWidth = Math.max(size / 20, 3);
  
  // Calculate the radius
  const radius = (size - strokeWidth) / 2;
  
  // Calculate the circumference
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke dash offset
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-dark-300"
        />
        
        {/* Foreground circle (animated) */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Score text */}
      <div 
        className="absolute inset-0 flex items-center justify-center font-bold text-gray-800 dark:text-gray-100"
        style={{ fontSize: size / 4 }}
      >
        {score}%
      </div>
    </div>
  );
};

export default ScoreGauge;