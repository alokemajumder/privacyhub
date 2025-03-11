import React from 'react';
import { Shield, Lock, Eye, Database, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <motion.div 
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 text-primary-500 mr-3" />
        <h1 className="text-3xl font-bold gradient-text">About PrivacyHub</h1>
      </div>
      
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          PrivacyHub was created with a simple but powerful mission: to make privacy policies understandable for everyone. 
          In today's digital world, we interact with dozens of services daily, each with their own privacy policies that 
          most of us never read. We believe that understanding how your data is being used should be easy, transparent, 
          and accessible.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <Eye className="h-6 w-6 text-primary-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Analyze Privacy Policies</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                We use advanced AI to analyze privacy policies and break them down into understandable metrics across key categories.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <Database className="h-6 w-6 text-primary-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Score Transparency</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                We evaluate how clearly companies explain their data practices and whether they're upfront about changes.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <Lock className="h-6 w-6 text-primary-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Assess Data Handling</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                We examine how companies handle your personal data, including deletion rights and third-party sharing.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <Users className="h-6 w-6 text-primary-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Evaluate User Control</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                We check whether you have meaningful control over what data is collected and how it's used.
              </p>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">How It Works</h2>
        <ol className="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-3">
          <li>
            <strong>Input a URL:</strong> Enter any website domain or direct link to a privacy policy.
          </li>
          <li>
            <strong>AI Analysis:</strong> Our system uses advanced AI to read and understand the privacy policy.
          </li>
          <li>
            <strong>Comprehensive Scoring:</strong> We evaluate the policy across multiple categories including data handling, transparency, and collection practices.
          </li>
          <li>
            <strong>Detailed Results:</strong> Get a clear breakdown of how the policy performs in each area, with specific recommendations for improvement.
          </li>
          <li>
            <strong>Local Storage:</strong> All your analyses are stored locally on your device for easy reference.
          </li>
        </ol>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="glass-card p-4 flex flex-col items-center text-center">
            <Award className="h-8 w-8 text-primary-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Transparency</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
              We believe in clear, honest communication about data practices.
            </p>
          </div>
          
          <div className="glass-card p-4 flex flex-col items-center text-center">
            <Shield className="h-8 w-8 text-primary-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Privacy</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
              We respect your privacy and store analysis data locally on your device.
            </p>
          </div>
          
          <div className="glass-card p-4 flex flex-col items-center text-center">
            <Users className="h-8 w-8 text-primary-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Accessibility</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
              We make complex privacy information accessible to everyone.
            </p>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Have questions, feedback, or suggestions? We'd love to hear from you! Reach out to us at 
          <a href="mailto:info@privacypriority.org" className="text-primary-500 hover:underline ml-1">info@privacypriority.org</a>.
        </p>
      </div>
    </motion.div>
  );
};

export default AboutPage;