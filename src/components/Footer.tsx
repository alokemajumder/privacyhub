import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="glass-card border-t border-gray-200 dark:border-dark-300 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
            PrivacyHub &copy; {new Date().getFullYear()} - <a href="https://github.com/privacypriority/privacyhub" className="hover:text-primary-500">Privacy Priority</a> Project - Helping users understand privacy policies
          </p>
          <div className="flex space-x-4">
            <Link 
              to="/privacy"
              className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/about"
              className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;