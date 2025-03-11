import React from 'react';
import { PrivacyAnalysis } from '../types';
import SiteHeader from './SiteHeader';
import CategorySection from './CategorySection';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { generatePDF } from '../utils/pdfGenerator';

interface AnalysisResultsProps {
  analysis: PrivacyAnalysis;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  // Group scores by category
  const categories = [...new Set(analysis.scores.map(score => score.category))].sort();
  
  const resultsRef = React.useRef<HTMLDivElement>(null);
  
  const downloadAsPDF = async () => {
    if (!resultsRef.current) return;
    
    try {
      await generatePDF(analysis, resultsRef.current);
      toast.success('Analysis PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };
  
  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      ref={resultsRef}
    >
      <SiteHeader analysis={analysis} />
      
      <div className="flex justify-end space-x-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadAsPDF}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </motion.button>
      </div>
      
      {categories.map((category, index) => (
        <CategorySection 
          key={category}
          category={category}
          scores={analysis.scores.filter(score => score.category === category)}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default AnalysisResults;