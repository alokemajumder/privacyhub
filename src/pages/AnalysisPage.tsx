import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import DetailedAnalysis from '../components/DetailedAnalysis';
import SEOHead from '../components/SEOHead';
import { PrivacyAnalysis } from '../types';
import { getAllAnalyses, deleteAnalysis, updateAnalysis } from '../lib/db';
import { analyzePrivacyPolicy } from '../utils/analyzer';

const AnalysisPage: React.FC = () => {
  const { brandName, id } = useParams<{ brandName: string; id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<PrivacyAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, [brandName, id]);

  const loadAnalysis = async () => {
    try {
      const analyses = await getAllAnalyses();
      const found = analyses.find(a => 
        a.brandName?.toLowerCase().replace(/\s+/g, '-') === brandName &&
        a.id?.toString() === id
      );
      
      if (found) {
        setAnalysis(found);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (analysis: PrivacyAnalysis) => {
    try {
      await deleteAnalysis(analysis);
      navigate('/');
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  const handleRefresh = async (url: string) => {
    try {
      setLoading(true);
      const refreshedAnalysis = await analyzePrivacyPolicy(url);
      await updateAnalysis(refreshedAnalysis);
      setAnalysis(refreshedAnalysis);
      
      // Update URL with new ID
      if (refreshedAnalysis.id && refreshedAnalysis.brandName) {
        navigate(`/privacy-policy-analyzer/${refreshedAnalysis.brandName.toLowerCase().replace(/\s+/g, '-')}/${refreshedAnalysis.id}`);
      }
    } catch (error) {
      console.error('Error refreshing analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <>
      <SEOHead 
        title={`${analysis.siteName} Privacy Policy Analysis | PrivacyHub.in`}
        description={analysis.summary}
        canonicalUrl={`https://privacyhub.in/privacy-policy-analyzer/${brandName}/${id}`}
        analysis={analysis}
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </motion.button>
          
          <h1 className="text-xl sm:text-2xl font-bold gradient-text ml-4">Privacy Analysis</h1>
        </div>
        
        <DetailedAnalysis 
          analysis={analysis}
          onBack={() => navigate('/')}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
        />
      </div>
    </>
  );
};

export default AnalysisPage;