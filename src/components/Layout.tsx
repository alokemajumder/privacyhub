import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github } from 'lucide-react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-100 transition-colors duration-200">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b border-gray-200 dark:border-dark-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-primary-500 mr-2" />
              <h1 className="text-2xl font-bold gradient-text">PrivacyHub</h1>
            </Link>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/privacypriority/privacyhub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
                aria-label="GitHub repository"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;