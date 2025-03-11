import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, FileText, Brain, Database, CheckCircle, Chrome } from 'lucide-react';

interface AnalysisProgressProps {
  stage: string | null;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ stage }) => {
  // Define the stages of analysis
  const stages = [
    { id: 'Validating URL', icon: Search, label: 'Validating URL' },
    { id: 'Searching for privacy policy', icon: Globe, label: 'Searching for privacy policy' },
    { id: 'Searching for privacy policy with browser', icon: Chrome, label: 'Searching with browser' },
    { id: 'Fetching policy content', icon: FileText, label: 'Fetching content' },
    { id: 'Fetching policy content with browser', icon: Chrome, label: 'Fetching with browser' },
    { id: 'Analyzing with AI', icon: Brain, label: 'Analyzing with AI' },
    { id: 'Calculating scores', icon: Database, label: 'Calculating scores' },
    { id: 'Saving results', icon: CheckCircle, label: 'Saving results' }
  ];

  // Find the current stage index
  const currentStageIndex = stage ? stages.findIndex(s => s.id === stage) : 0;
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-6"></div>
      
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6">
        {stage || 'Analyzing privacy policy...'}
      </h3>
      
      <div className="relative">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-dark-300 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary-500"
            initial={{ width: '0%' }}
            animate={{ 
              width: stage ? `${((currentStageIndex + 1) / stages.length) * 100}%` : '100%' 
            }}
            transition={{ 
              duration: 0.5,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Stage indicators */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {stages.map((s, index) => {
            const Icon = s.icon;
            const isActive = stage === s.id;
            const isPast = stage ? index < currentStageIndex : false;
            const isCurrent = isActive;
            
            return (
              <motion.div 
                key={s.id}
                className={`flex flex-col items-center p-3 rounded-lg ${
                  isCurrent 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : isPast 
                      ? 'text-gray-500 dark:text-gray-400' 
                      : 'text-gray-400 dark:text-gray-600'
                }`}
                initial={{ opacity: 0.5, y: 10 }}
                animate={{ 
                  opacity: isCurrent || isPast ? 1 : 0.5,
                  y: 0,
                  scale: isCurrent ? 1.05 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={`p-2 rounded-full ${
                  isCurrent 
                    ? 'bg-primary-100 dark:bg-primary-800/30' 
                    : isPast 
                      ? 'bg-gray-100 dark:bg-dark-300' 
                      : 'bg-gray-100 dark:bg-dark-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-2 text-center">{s.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;