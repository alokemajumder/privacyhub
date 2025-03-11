import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PrivacyAnalysis } from '../types';
import ScoreGauge from './ScoreGauge';

interface AlphabeticalBrowserProps {
  analyses: PrivacyAnalysis[];
  onSelect: (analysis: PrivacyAnalysis) => void;
}

const AlphabeticalBrowser: React.FC<AlphabeticalBrowserProps> = ({ analyses, onSelect }) => {
  // Filter out analyses without ID or brandName
  const validAnalyses = analyses.filter(a => a.id && a.brandName);

  // Generate all alphabet letters
  const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  
  // Group analyses by first letter of brand name
  const groupedAnalyses = alphabet.reduce((acc, letter) => {
    acc[letter] = validAnalyses.filter(analysis => {
      const firstLetter = analysis.brandName?.charAt(0).toUpperCase() || 
                         analysis.siteName.charAt(0).toUpperCase();
      return firstLetter === letter;
    });
    return acc;
  }, {} as Record<string, PrivacyAnalysis[]>);

  // Get available letters and sort them
  const availableLetters = alphabet;

  // State for active tab
  const [activeTab, setActiveTab] = useState(availableLetters.find(letter => groupedAnalyses[letter].length > 0) || 'A');
  
  // Ref for tabs container
  const tabsRef = useRef<HTMLDivElement>(null);

  // Function to scroll tab into view
  const scrollTabIntoView = (letter: string) => {
    if (tabsRef.current) {
      const tabElement = tabsRef.current.querySelector(`[data-letter="${letter}"]`);
      if (tabElement) {
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const tabRect = tabElement.getBoundingClientRect();
        
        if (tabRect.left < tabsRect.left || tabRect.right > tabsRect.right) {
          tabElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }
    }
  };

  // Handle tab click
  const handleTabClick = (letter: string) => {
    setActiveTab(letter);
    scrollTabIntoView(letter);
  };

  // Scroll tabs left/right
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = tabsRef.current.clientWidth / 2;
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div className="relative glass-card mb-6">
        <div className="absolute left-0 top-0 bottom-0 flex items-center">
          <button
            onClick={() => scrollTabs('left')}
            className="p-2 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-l-lg hover:bg-gray-200 dark:hover:bg-dark-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        
        <div 
          className="flex overflow-x-auto scrollbar-hide py-2 px-12" 
          ref={tabsRef}
        >
          {availableLetters.map(letter => (
            <button
              key={letter}
              data-letter={letter}
              className={`flex-shrink-0 px-4 py-2 mx-1 rounded-lg font-medium transition-colors ${
                activeTab === letter
                  ? 'bg-primary-500 text-white'
                  : groupedAnalyses[letter].length > 0
                    ? 'bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-400'
                    : 'bg-gray-50 dark:bg-dark-200 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
              onClick={() => handleTabClick(letter)}
              disabled={groupedAnalyses[letter].length === 0}
            >
              {letter}
              {groupedAnalyses[letter].length > 0 && (
                <span className="ml-1 text-xs">({groupedAnalyses[letter].length})</span>
              )}
            </button>
          ))}
        </div>
        
        <div className="absolute right-0 top-0 bottom-0 flex items-center">
          <button
            onClick={() => scrollTabs('right')}
            className="p-2 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-r-lg hover:bg-gray-200 dark:hover:bg-dark-300"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {groupedAnalyses[activeTab].length > 0 ? (
            groupedAnalyses[activeTab].map((analysis, index) => (
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
                
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-dark-300">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(analysis.analysisDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 glass-card">
              <p className="text-gray-500 dark:text-gray-400">
                No companies found starting with '{activeTab}'
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AlphabeticalBrowser;