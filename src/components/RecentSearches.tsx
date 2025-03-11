import React from 'react';
import { motion } from 'framer-motion';
import { History, ExternalLink } from 'lucide-react';
import { PrivacyAnalysis } from '../types';
import ScoreGauge from './ScoreGauge';

interface RecentSearchesProps {
  analyses: PrivacyAnalysis[];
  onSelect: (analysis: PrivacyAnalysis) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ analyses, onSelect }) => {
  // Sort analyses by lastUpdated (most recent first)
  const sortedAnalyses = [...analyses]
    .filter(a => a.id && a.brandName) // Only show analyses with ID and brandName
    .sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0))
    .slice(0, 10); // Only show the 10 most recent

  if (sortedAnalyses.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center mb-6">
        <History className="h-6 w-6 text-primary-500 mr-2" />
        <h3 className="text-xl font-bold gradient-text">Recent Searches</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedAnalyses.map((analysis, index) => (
          <motion.div
            key={analysis.siteUrl}
            className="glass-card p-5 cursor-pointer hover:shadow-glow transition-all duration-300"
            onClick={() => onSelect(analysis)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center mb-3">
              <img 
                src={analysis.logoUrl} 
                alt={`${analysis.siteName} logo`}
                className="w-8 h-8 mr-3 object-contain bg-white dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-dark-300"
                loading="lazy"
              />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {analysis.brandName || analysis.siteName}
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <span className="truncate">
                    {new URL(analysis.siteUrl).hostname.replace('www.', '')}
                  </span>
                  <a 
                    href={analysis.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when clicking the link
                    }}
                    className="ml-1 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Privacy Score</span>
              <ScoreGauge 
                score={Math.round((analysis.totalScore / analysis.maxTotalScore) * 100)} 
                size={40} 
              />
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-dark-300">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(analysis.lastUpdated || analysis.analysisDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;