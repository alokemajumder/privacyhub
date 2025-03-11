import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  label, 
  showValue = true,
  size = 'md',
  animated = true
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  // Color based on percentage
  const getColor = () => {
    if (percentage < 30) return 'from-accent-red to-accent-red/70';
    if (percentage < 70) return 'from-accent-yellow to-accent-yellow/70';
    return 'from-accent-green to-accent-green/70';
  };

  // Height based on size
  const getHeight = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-4';
      default: return 'h-2.5';
    }
  };

  return (
    <div className="w-full">
      {label && <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</div>}
      <div className={`w-full bg-gray-200 dark:bg-dark-300 rounded-full ${getHeight()} overflow-hidden`}>
        <motion.div 
          className={`${getHeight()} rounded-full bg-gradient-to-r ${getColor()} shadow-glow`} 
          style={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1 : 0, 
            ease: "easeOut",
            delay: 0.2
          }}
        />
      </div>
      {showValue && (
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
          <span>{value}/{max}</span>
          <span className={`font-bold ${
            percentage < 30 ? 'text-accent-red' : 
            percentage < 70 ? 'text-accent-yellow' : 
            'text-accent-green'
          }`}>
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;