import React from 'react';
import { PrivacyAnalysis } from '../types';
import ProgressBar from './ProgressBar';
import { Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import ScoreGauge from './ScoreGauge';

interface SiteHeaderProps {
  analysis: PrivacyAnalysis;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ analysis }) => {
  const percentage = Math.round((analysis.totalScore / analysis.maxTotalScore) * 100);
  
  const getScoreIcon = () => {
    if (percentage < 30) {
      return <AlertTriangle className="w-12 h-12 text-accent-red" />;
    } else if (percentage < 70) {
      return <Shield className="w-12 h-12 text-accent-yellow" />;
    } else {
      return <CheckCircle className="w-12 h-12 text-accent-green" />;
    }
  };
  
  const getScoreText = () => {
    if (percentage < 30) {
      return "Poor";
    } else if (percentage < 50) {
      return "Fair";
    } else if (percentage < 70) {
      return "Good";
    } else if (percentage < 90) {
      return "Very Good";
    } else {
      return "Excellent";
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
  
  // Extract domain name from URL
  const getDomainName = () => {
    try {
      return new URL(analysis.siteUrl).hostname.replace('www.', '');
    } catch (e) {
      return analysis.siteName;
    }
  };
  
  // Group scores by category for the quick view
  const categories = [...new Set(analysis.scores.map(score => score.category))];
  const categoryScores = categories.map(category => {
    const categoryScores = analysis.scores.filter(score => score.category === category);
    const totalScore = categoryScores.reduce((sum, score) => sum + score.score, 0);
    const maxScore = categoryScores.reduce((sum, score) => sum + score.maxScore, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);
    return { category, percentage };
  });
  
  return (
    <motion.div 
      className="glass-card p-4 sm:p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-grow">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{getDomainName()}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Privacy Policy</p>
          <a 
            href={analysis.siteUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:underline mb-3 inline-flex items-center text-sm sm:text-base break-all"
          >
            <span className="truncate max-w-[250px] sm:max-w-full">{analysis.siteUrl}</span>
            <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
          </a>
          
          <div className="mt-4">
            <ProgressBar 
              value={analysis.totalScore} 
              max={analysis.maxTotalScore} 
              label="Overall Privacy Score" 
              size="lg"
            />
          </div>
        </div>
        
        <div className="flex-shrink-0 flex flex-col items-center">
          <ScoreGauge score={percentage} size={100} />
          <span className="text-lg font-bold mt-2 text-gray-800 dark:text-gray-100">{getScoreText()}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Analyzed on {formatDate(analysis.analysisDate)}</span>
        </div>
      </div>
      
      {/* Category Score Quick View */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categoryScores.map(({ category, percentage }) => (
          <div key={category} className="bg-gray-50 dark:bg-dark-200 rounded-lg p-3 flex items-center">
            <ScoreGauge score={percentage} size={50} />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{percentage}% Score</p>
            </div>
          </div>
        ))}
      </div>
      
      {analysis.summary && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-dark-300">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">AI-Generated Summary</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{analysis.summary}</p>
        </div>
      )}
    </motion.div>
  );
};

export default SiteHeader;