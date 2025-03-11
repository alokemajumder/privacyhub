import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, Database, Users, Award, Github } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AnalysisProgress from '../components/AnalysisProgress';
import AlphabeticalBrowser from '../components/AlphabeticalBrowser';
import RecentSearches from '../components/RecentSearches';
import SEOHead from '../components/SEOHead';
import { PrivacyAnalysis } from '../types';
import { analyzePrivacyPolicy } from '../utils/analyzer';
import { getAllAnalyses } from '../db';

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<PrivacyAnalysis[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const loadedAnalyses = await getAllAnalyses();
      setAnalyses(loadedAnalyses);
    } catch (error) {
      console.error('Error loading analyses:', error);
    }
  };

  const handleSearch = async (url: string) => {
    try {
      setIsLoading(true);
      const analysis = await analyzePrivacyPolicy(url, setAnalysisStage);
      
      // Navigate to the analysis page with the new format
      if (analysis.id && analysis.brandName) {
        navigate(`/privacy-policy-analyzer/${analysis.brandName.toLowerCase().replace(/\s+/g, '-')}/${analysis.id}`);
      }
    } catch (error) {
      console.error('Error analyzing privacy policy:', error);
    } finally {
      setIsLoading(false);
      setAnalysisStage(null);
    }
  };

  const handleAnalysisSelect = (analysis: PrivacyAnalysis) => {
    if (analysis.id && analysis.brandName) {
      navigate(`/privacy-policy-analyzer/${analysis.brandName.toLowerCase().replace(/\s+/g, '-')}/${analysis.id}`);
    }
  };

  return (
    <>
      <SEOHead />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Analyze Privacy Policies
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Enter a website domain or privacy policy URL to analyze it. We'll find the privacy policy and evaluate it based on handling, transparency, and data collection practices.
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {isLoading ? (
          <div className="text-center py-12">
            <AnalysisProgress stage={analysisStage} />
          </div>
        ) : (
          <>
            {/* Recent Searches Section */}
            <RecentSearches 
              analyses={analyses}
              onSelect={handleAnalysisSelect}
            />
            
            {/* Browse Section */}
            <div className="mt-12">
              <h3 className="text-xl font-bold gradient-text mb-6">Browse Privacy Policies</h3>
              <AlphabeticalBrowser 
                analyses={analyses}
                onSelect={handleAnalysisSelect}
              />
            </div>
            
            {/* Why Online Privacy Matters Section */}
            <div className="mt-16 glass-card p-6">
              <h3 className="text-xl font-bold gradient-text mb-4">Why Online Privacy Matters</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  In today's digital age, your personal data is more valuable—and vulnerable—than ever. Every website you visit, app you use, and service you sign up for collects data about you. Understanding how this data is collected, used, and protected is crucial for maintaining your privacy and security online.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Key Privacy Concerns</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                      <li>Personal data collection and storage</li>
                      <li>Third-party data sharing</li>
                      <li>Targeted advertising and profiling</li>
                      <li>Data breaches and security risks</li>
                      <li>Long-term data retention</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Impact on Users</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                      <li>Identity theft and fraud risks</li>
                      <li>Manipulation through targeted content</li>
                      <li>Financial exploitation</li>
                      <li>Loss of personal autonomy</li>
                      <li>Unwanted surveillance</li>
                    </ul>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300">
                  Privacy policies are your window into how companies handle your personal information. By understanding these policies, you can make informed decisions about which services to trust with your data and how to protect your privacy online.
                </p>
              </div>
            </div>
            
            {/* Open Source Contribution Section */}
            <div className="mt-8 glass-card p-6">
              <h3 className="text-xl font-bold gradient-text mb-4">Open Source Contribution</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    PrivacyHub is an open source project dedicated to improving privacy transparency across the web. We believe in the power of community collaboration to create more effective privacy tools for everyone.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    By contributing to PrivacyHub, you're helping build a more privacy-conscious internet where users can better understand how their data is being used and protected.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <a 
                      href="https://github.com/privacypriority/privacyhub" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Ways to Contribute</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <span>Improve AI analysis algorithms for more accurate privacy policy scoring</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <span>Enhance the policy detection system to better locate privacy policies on websites</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                      <span>Add support for additional languages and regional privacy regulations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                      <span>Develop browser extensions for instant privacy policy analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">5</span>
                      <span>Report bugs and suggest new features to improve user experience</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;