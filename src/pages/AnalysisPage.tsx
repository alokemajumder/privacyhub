import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import DetailedAnalysis from '../components/DetailedAnalysis';
import SEOHead from '../components/SEOHead';
import { PrivacyAnalysis } from '../types';
import { getAnalysisById, deleteAnalysis, updateAnalysis } from '../lib/db';
import { analyzePrivacyPolicy } from '../utils/analyzer';

const AnalysisPage: React.FC = () => {
  const { brandName, id: idString } = useParams<{ brandName: string; id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<PrivacyAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalysis();
  }, [brandName, idString]);

  const loadAnalysis = async () => {
    setLoading(true);
    setAnalysisError(null);
    try {
      if (!idString) {
        console.error('No ID provided in URL');
        setAnalysisError('No analysis ID found in the URL.');
        // navigate('/'); // Keep navigate for now, but error is set
        setLoading(false);
        return;
      }

      const numericId = parseInt(idString, 10);
      if (isNaN(numericId)) {
        console.error('Invalid ID provided in URL:', idString);
        setAnalysisError('Invalid analysis ID format in the URL.');
        // navigate('/'); // Keep navigate for now, but error is set
        setLoading(false);
        return;
      }

      const found = await getAnalysisById(numericId);

      if (found && found.brandName?.toLowerCase().replace(/\s+/g, '-') === brandName) {
        setAnalysis(found);
        setAnalysisError(null); // Clear previous errors if any
      } else {
        if (!found) {
          console.log(`Analysis with ID ${numericId} not found.`);
          setAnalysisError('The requested analysis was not found.');
        } else {
          console.log(`Brand name mismatch: URL brandName "${brandName}", fetched brandName "${found.brandName?.toLowerCase().replace(/\s+/g, '-')}"`);
          setAnalysisError('Analysis data mismatch. Please check the URL.');
        }
        // navigate('/'); // Consider delaying or removing navigation to show the error
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
      setAnalysisError('Failed to load the analysis data. It might be an invalid link or a server issue.');
      // navigate('/'); // Keep the navigate for now, but an error message would be set first
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
    setAnalysisError(null);
    try {
      setLoading(true);
      const refreshedAnalysis = await analyzePrivacyPolicy(url);
      await updateAnalysis(refreshedAnalysis);
      setAnalysis(refreshedAnalysis);
      setAnalysisError(null); // Clear error on success
      
      // Update URL with new ID
      if (refreshedAnalysis.id && refreshedAnalysis.brandName) {
        navigate(`/privacy-policy-analyzer/${refreshedAnalysis.brandName.toLowerCase().replace(/\s+/g, '-')}/${refreshedAnalysis.id}`);
      }
    } catch (error) {
      console.error('Error refreshing analysis:', error);
      let message = 'An unexpected error occurred while refreshing the analysis.';
      if (error instanceof Error) {
        message = error.message; // Use the message from the thrown error
      }
      setAnalysisError(message);
      setAnalysis(null); // Clear old analysis data on error
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

  if (analysisError) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <AlertCircle className="h-12 w-12 text-accent-red mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Analysis Failed</h2>
        <p className="text-gray-600 dark:text-gray-400">{analysisError}</p>
        <button
          onClick={() => navigate('/')} // Go back home
          className="mt-6 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  if (!analysis) {
    // This case might be hit if loading is done, no error, but still no analysis
    // (e.g. after a failed refresh cleared it or initial load found nothing and didn't set an error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No analysis data available. This could be due to an error or the analysis was not found.</p>
         <button
          onClick={() => navigate('/')} // Go back home
          className="mt-6 ml-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={`${analysis.siteName} Privacy Policy Analysis | PrivacyHub.in`}
        description={analysis.summary}
        canonicalUrl={`https://privacyhub.in/privacy-policy-analyzer/${brandName}/${idString}`}
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