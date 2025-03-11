import React, { useState } from 'react';
import { PrivacyScore } from '../types';
import ScoreCard from './ScoreCard';
import ProgressBar from './ProgressBar';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Eye, 
  Database, 
  AlertTriangle,
  CheckCircle,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CategorySectionProps {
  category: string;
  scores: PrivacyScore[];
  index: number;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, scores, index }) => {
  const [collapsed, setCollapsed] = useState(false);
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  const maxScore = scores.reduce((sum, score) => sum + score.maxScore, 0);
  
  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'handling':
        return <ShieldCheck className="h-6 w-6 text-primary-500" />;
      case 'transparency':
        return <Eye className="h-6 w-6 text-primary-500" />;
      case 'collection':
        return <Database className="h-6 w-6 text-primary-500" />;
      default:
        return <Shield className="h-6 w-6 text-primary-500" />;
    }
  };
  
  const getScoreIcon = () => {
    const percentage = Math.round((totalScore / maxScore) * 100);
    if (percentage < 30) {
      return <AlertTriangle className="h-5 w-5 text-accent-red" />;
    } else if (percentage < 70) {
      return <Shield className="h-5 w-5 text-accent-yellow" />;
    } else {
      return <CheckCircle className="h-5 w-5 text-accent-green" />;
    }
  };
  
  const getCategoryDescription = () => {
    switch (category.toLowerCase()) {
      case 'handling':
        return "How the privacy policy handles your personal data, including deletion, sharing, and marketing.";
      case 'transparency':
        return "How clear and transparent the policy is about security practices, history, and notifications.";
      case 'collection':
        return "What data is collected, why it's collected, and what control you have over it.";
      default:
        return "Evaluation of privacy policy aspects.";
    }
  };
  
  return (
    <motion.div 
      className="mb-12 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            {getCategoryIcon()}
            <div>
              <h2 className="text-xl font-bold gradient-text">{category}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getCategoryDescription()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getScoreIcon()}
            <div className="w-24 sm:w-48">
              <ProgressBar value={totalScore} max={maxScore} size="sm" />
            </div>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-dark-300"
            >
              {collapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {!collapsed && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {scores.map((score, idx) => (
            <ScoreCard key={idx} score={score} index={idx} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategorySection;