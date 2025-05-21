import React, { useState } from 'react';
import { Search, AlertCircle, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (url: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  
  const validateUrl = (input: string): boolean => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError('Please enter a URL or domain name.');
      return false;
    }

    // Check for a dot, basic check for domain/URL structure
    if (!trimmedInput.includes('.')) {
      setError('Invalid format. Please enter a valid domain (e.g., example.com) or a full URL.');
      return false;
    }

    // If it looks like a full URL path, it should have a scheme
    if (trimmedInput.includes('/') && !trimmedInput.match(/^https?:\/\//i)) {
      setError('Full URLs should start with http:// or https://. For domains like example.com, we will try https automatically.');
      return false;
    }
    
    // Add any other simple, universal URL validation if desired (e.g. no spaces)
    if (trimmedInput.includes(' ')) {
        setError('URL cannot contain spaces.');
        return false;
    }

    setError('');
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim(); // Trim the URL
    if (validateUrl(trimmedUrl)) { // Validate the trimmed URL
      onSearch(trimmedUrl); // Pass the trimmed URL to onSearch
    }
  };
  
  // List of popular websites for examples
  const popularSites = [
    { name: 'Facebook', url: 'https://www.facebook.com/privacy/policy' },
    { name: 'WhatsApp', url: 'https://www.whatsapp.com/legal/privacy-policy' },
    { name: 'Instagram', url: 'https://help.instagram.com/519522125107875' },
    { name: 'Amazon', url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ' }
  ];
  
  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter website domain or privacy policy URL"
            className="neo-input block w-full pl-10 pr-3 py-3 text-gray-900 dark:text-gray-100 focus:outline-none"
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="mt-2 flex items-start text-accent-red text-sm">
            <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="mt-4 flex justify-center">
          <motion.button
            type="submit"
            className="glass-button px-8 py-3 font-medium focus:outline-none"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Chrome className="h-5 w-5 mr-2" />
                <span>Analyze Privacy Policy</span>
              </div>
            )}
          </motion.button>
        </div>
        
        <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400 flex flex-wrap justify-center">
          <span className="mr-1 w-full sm:w-auto mb-1 sm:mb-0">Try with: </span>
          {popularSites.map((site, index) => (
            <React.Fragment key={site.url}>
              <button 
                type="button" 
                onClick={() => setUrl(site.url)} 
                className="text-primary-500 hover:underline mx-1"
              >
                {site.name}
              </button>
              {index < popularSites.length - 1 && <span className="hidden sm:inline">|</span>}
            </React.Fragment>
          ))}
        </div>
      </form>
    </motion.div>
  );
};

export default SearchBar;