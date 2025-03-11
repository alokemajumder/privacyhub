import React, { useState } from 'react';
import { PrivacyScore } from '../types';
import ProgressBar from './ProgressBar';
import { motion } from 'framer-motion';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface ScoreCardProps {
  score: PrivacyScore;
  index: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, index }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div 
      className="score-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 pr-2">{score.criteria}</h3>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="relative group">
            <Info className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help" />
            <div className="absolute right-0 w-64 p-2 mt-2 text-xs bg-white dark:bg-dark-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {score.description || "This criteria evaluates how the privacy policy handles this specific aspect of user privacy."}
            </div>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <ProgressBar value={score.score} max={score.maxScore} />
      
      {(expanded || score.recommendations) && (
        <motion.div 
          className="mt-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {score.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {score.description}
            </p>
          )}
          
          {score.recommendations && (
            <div className="mt-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-primary-600 dark:text-primary-400">Recommendation: </span>
                {score.recommendations}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ScoreCard;