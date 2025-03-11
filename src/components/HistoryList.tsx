import React from 'react';
import { PrivacyAnalysis } from '../types';
import ProgressBar from './ProgressBar';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Shield, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { deleteAnalysis } from '../utils/tomlStorage';
import { analyzePrivacyPolicy } from '../utils/analyzer';
import ScoreGauge from './ScoreGauge';

interface HistoryListProps {
  analyses: PrivacyAnalysis[];
  onSelect: (analysis: PrivacyAnalysis) => void;
  onRefresh: (url: string) => Promise<void>;
  onDelete: (analysis: PrivacyAnalysis) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ analyses, onSelect, onRefresh, onDelete }) => {
  if (analyses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Shield className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-lg">No previous analyses found.</p>
        <p className="text-sm mt-2">Enter a URL in the search bar to analyze a privacy policy.</p>
      </div>
    );
  }
  
  // Sort by last updated (most recent first)
  const sortedAnalyses = [...analyses].sort((a, b) => 
    (b.lastUpdated || 0) - (a.lastUpdated || 0)
  );
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const getScoreIcon = (analysis: PrivacyAnalysis) => {
    const percentage = Math.round((analysis.totalScore / analysis.maxTotalScore) * 100);
    if (percentage < 30) {
      return <AlertTriangle className="h-5 w-5 text-accent-red" />;
    } else if (percentage < 70) {
      return <Shield className="h-5 w-5 text-accent-yellow" />;
    } else {
      return <CheckCircle className="h-5 w-5 text-accent-green" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleDelete = (e: React.MouseEvent, analysis: PrivacyAnalysis) => {
    e.stopPropagation();
    onDelete(analysis);
    toast.success(`Removed ${getDomainName(analysis)} from history`);
  };
  
  const handleRefresh = async (e: React.MouseEvent, analysis: PrivacyAnalysis) => {
    e.stopPropagation();
    await onRefresh(analysis.siteUrl);
  };
  
  // Get domain name from URL
  const getDomainName = (analysis: PrivacyAnalysis) => {
    try {
      return new URL(analysis.siteUrl).hostname.replace('www.', '');
    } catch (e) {
      return analysis.siteName;
    }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {sortedAnalyses.map((analysis, index) => (
        <motion.div 
          key={index}
          className="glass-card p-5 cursor-pointer hover:shadow-glow transition-all duration-300"
          onClick={() => onSelect(analysis)}
          variants={item}
        >
          <div className="flex items-center mb-3">
            <img 
              src={analysis.logoUrl} 
              alt={`${analysis.siteName} logo`}
              className="w-10 h-10 mr-3 object-contain bg-white dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-dark-300"
              loading="lazy"
            />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{getDomainName(analysis)}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Privacy Policy
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Privacy Score</span>
            <ScoreGauge 
              score={Math.round((analysis.totalScore / analysis.maxTotalScore) * 100)} 
              size={40} 
            />
          </div>
          
          <ProgressBar 
            value={analysis.totalScore} 
            max={analysis.maxTotalScore} 
            showValue={true}
            size="sm"
          />
          
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-dark-300">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(analysis.analysisDate)}
            </div>
            <div className="flex space-x-2">
              <button 
                className="p-1 text-gray-400 hover:text-primary-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-300"
                onClick={(e) => handleRefresh(e, analysis)}
                title="Refresh analysis"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button 
                className="p-1 text-gray-400 hover:text-accent-red rounded-full hover:bg-gray-100 dark:hover:bg-dark-300"
                onClick={(e) => handleDelete(e, analysis)}
                title="Remove from history"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div> ))}
    </motion.div>
  );
};

export default HistoryList;