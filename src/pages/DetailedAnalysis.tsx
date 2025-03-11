import React, { useState } from 'react';
import { PrivacyAnalysis } from '../types';
import SiteHeader from '../components/SiteHeader';
import CategorySection from '../components/CategorySection';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowLeft, RefreshCw, Trash2, AlertCircle, X, Code } from 'lucide-react';
import { toast } from 'react-toastify';
import { generatePDF } from '../utils/pdfGenerator';

interface DetailedAnalysisProps {
  analysis: PrivacyAnalysis;
  onBack: () => void;
  onDelete: (analysis: PrivacyAnalysis) => void;
  onRefresh: (url: string) => Promise<void>;
}

const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ 
  analysis, 
  onBack,
  onDelete,
  onRefresh
}) => {
  // Group scores by category
  const categories = [...new Set(analysis.scores.map(score => score.category))].sort();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showJsonView, setShowJsonView] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(categories[0] || 'Handling');
  
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
  
  // Function to copy JSON to clipboard
  const copyJsonToClipboard = () => {
    const jsonString = JSON.stringify(analysis, null, 2);
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        toast.success('JSON copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy JSON:', err);
        toast.error('Failed to copy JSON to clipboard');
      });
  };
  
  return (
    <motion.div 
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </motion.button>
        
        <h1 className="text-xl sm:text-2xl font-bold gradient-text ml-4">Privacy Analysis</h1>
      </div>
      
      {/* AI Analysis Badge */}
      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" 
            alt="Gemini AI Logo"
            className="h-8 w-8 mr-3"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Analyzed by Google's Gemini AI
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This analysis was performed using Google's advanced Gemini AI technology
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Analysis Date: {new Date(analysis.analysisDate).toLocaleDateString()}
        </div>
      </div>
      
      <div ref={resultsRef}>
        <SiteHeader analysis={analysis} />
        
        <div className="flex flex-wrap justify-between gap-2 mb-6">
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDisclaimer(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-colors border border-primary-300 dark:border-primary-700"
            >
              <AlertCircle className="h-4 w-4" />
              <span>Disclaimer</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowJsonView(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
            >
              <Code className="h-4 w-4" />
              <span>View JSON</span>
            </motion.button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadAsPDF}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRefresh(analysis.siteUrl)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(analysis)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors text-sm"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </motion.button>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="mb-6 overflow-hidden">
          <div className="glass-card p-1">
            <div className="flex overflow-x-auto scrollbar-hide py-1 px-1">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`flex-shrink-0 px-3 sm:px-6 py-2 mx-1 rounded-lg font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                    activeTab === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-400'
                  }`}
                  onClick={() => setActiveTab(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {categories.map((category) => (
            activeTab === category && (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full overflow-hidden"
              >
                <CategorySection 
                  category={category}
                  scores={analysis.scores.filter(score => score.category === category)}
                  index={0}
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
      
      {/* AI Analysis Information */}
      <div className="mt-8 glass-card p-6">
        <div className="flex items-center mb-4">
          <img 
            src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" 
            alt="Gemini AI Logo"
            className="h-10 w-10 mr-4"
          />
          <h2 className="text-xl font-bold gradient-text">AI-Powered Analysis</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This privacy policy analysis was performed using Google's Gemini AI, a state-of-the-art language model designed to understand and evaluate complex documents. The AI analyzes multiple aspects of privacy policies, including:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Analysis Capabilities</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Natural language understanding of legal text</li>
              <li>Pattern recognition across privacy practices</li>
              <li>Contextual analysis of data handling</li>
              <li>Automated scoring based on best practices</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Evaluation Criteria</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Data collection and usage transparency</li>
              <li>User control over personal information</li>
              <li>Third-party sharing practices</li>
              <li>Security measures and breach notifications</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Privacy Policy Information Section */}
      <div className="mt-12 glass-card p-4 sm:p-6">
        <h2 className="text-xl font-bold gradient-text mb-4">Understanding Privacy Policies</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Understanding Privacy Policies Is Essential</strong><br />
            Most people wouldn't choose to spend their weekends poring over lengthy privacy policies. Without prior experience, reading the fine print before clicking "Accept" can feel overwhelming. Our privacy policy analyzer simplifies this process by providing a concise TL;DR summary of any privacy policy, so you know exactly what you're agreeing to.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            Privacy policies aren't just dull legal documents—they remind you that your personal and browsing data is incredibly valuable. In today's complex digital landscape, understanding how your data is collected, used, and protected is critical. Key points typically covered include:
          </p>
          
          <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Data Collected:</strong> What types of data are gathered, from device and network identifiers to personal information.</li>
            <li><strong>Purpose of Collection:</strong> Why your data is collected, helping you determine whether a website is asking for more information than necessary.</li>
            <li><strong>Data Usage:</strong> How the collected data is utilized—whether to improve services, for ad targeting, or potentially for resale.</li>
            <li><strong>Third-Party Sharing:</strong> Who else might have access to your data, such as advertising or corporate partners.</li>
            <li><strong>Data Security:</strong> How your data is safeguarded. With millions of records leaking in just one quarter of 2022, ensuring robust security measures is more important than ever.</li>
          </ul>
          
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            <strong>Privacy Policy Red Flags: What to Watch For</strong><br />
            When reviewing privacy policies, be alert for warning signs that a service may not be trustworthy with your data:
          </p>
          
          <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Excessive or Irrelevant Data Requests:</strong> Is the information being collected truly necessary for the service?</li>
            <li><strong>Mentions of "Advertising":</strong> If a policy indicates that your data is shared with advertising partners, it likely means multiple third parties have access to your information.</li>
            <li><strong>Vague Security Descriptions:</strong> Phrases like "We ensure your data security" without further explanation should raise concerns about the measures in place.</li>
          </ul>
          
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            <strong>Taking Control of Your Data Privacy</strong><br />
            After reading and understanding a privacy policy, and clicking "Accept," it's vital to remain proactive about your own privacy. Privacy policies help demystify data collection processes, empowering you to navigate the digital world with greater confidence. Remember, protecting your personal data is ultimately your responsibility.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            <strong>How PrivacyHub.in Helps</strong><br />
            PrivacyHub.in is designed to empower you with the knowledge you need to make informed decisions about your privacy. By analyzing privacy policies and breaking them down into clear, data-driven insights, our tool helps you quickly understand how websites handle your data. Whether you're researching best practices or simply ensuring that your favorite sites are trustworthy, PrivacyHub.in puts the power of digital transparency in your hands—so you're never in the dark about your personal information.
          </p>
        </div>
      </div>
      
      {/* Disclaimer Popup */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDisclaimer(false)}
          >
            <motion.div
              className="glass-card max-w-2xl p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowDisclaimer(false)}
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-accent-yellow mr-2 flex-shrink-0" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Disclaimer</h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                The analysis and scoring provided by PrivacyHub.in are offered solely for informational purposes and are not intended to constitute legal advice or a substitute for professional consultation. While we strive to evaluate and present privacy policy data as accurately as possible using AI-driven analysis, inaccuracies may occur.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                The scores and analysis should be independently verified, and users are encouraged to consult legal professionals for definitive guidance. Additionally, our AI help point is available as an auxiliary resource to address queries or clarify potential discrepancies; however, it does not replace expert advice.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                PrivacyHub.in, its affiliates, and its team shall not be held liable for any decisions, actions, or outcomes resulting from reliance on this information. Use this service at your own risk.
              </p>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDisclaimer(false)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg"
                >
                  I Understand
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* JSON View Popup */}
      <AnimatePresence>
        {showJsonView && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowJsonView(false)}
          >
            <motion.div
              className="glass-card max-w-4xl w-full p-4 sm:p-6 relative max-h-[90vh] flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowJsonView(false)}
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Code className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Analysis JSON Data</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyJsonToClipboard}
                  className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg"
                >
                  Copy to Clipboard
                </motion.button>
              </div>
              
              <div className="overflow-auto flex-grow bg-gray-100 dark:bg-dark-300 rounded-lg p-4">
                <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {JSON.stringify(analysis, null, 2)}
                </pre>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowJsonView(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-dark-400 text-gray-800 dark:text-gray-200 rounded-lg"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DetailedAnalysis;