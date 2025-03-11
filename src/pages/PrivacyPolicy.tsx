import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  return (
    <motion.div 
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 text-primary-500 mr-3" />
        <h1 className="text-3xl font-bold gradient-text">PrivacyHub Privacy Policy</h1>
      </div>
      
      <div className="glass-card p-6 mb-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Introduction</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Welcome to PrivacyHub. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">The Data We Collect</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We collect minimal personal data when you use our service. The only personal information we collect is:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li>IP address (collected automatically)</li>
          <li>Browser type and version (collected automatically)</li>
          <li>Operating system (collected automatically)</li>
          <li>Referral source (collected automatically)</li>
          <li>Length of visit, page views, website navigation (collected automatically)</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">How We Use Your Data</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We use the data we collect for the following purposes:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li>To provide and maintain our service</li>
          <li>To analyze usage patterns and improve our website</li>
          <li>To detect, prevent, and address technical issues</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Google Analytics</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We use Google Analytics to analyze the use of our website. Google Analytics gathers information about website use by means of cookies. The information gathered is used to create reports about the use of our website. Google's privacy policy is available at: <a href="https://www.google.com/policies/privacy/" className="text-primary-500 hover:underline" target="_blank" rel="noopener noreferrer">https://www.google.com/policies/privacy/</a>
        </p>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Data Storage</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          When you analyze a privacy policy using our service, we store the analysis results in your browser's local storage. This data remains on your device and is not transmitted to our servers. You can clear this data at any time by clearing your browser's local storage or by using the delete function within our application.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Third-Party Access</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include Google Analytics as described above, which assists us in analyzing how our service is used.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Security</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We implement appropriate security measures to protect your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Changes to This Privacy Policy</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          If you have any questions about this Privacy Policy, please contact us at info@privacypriority.org.
        </p>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;