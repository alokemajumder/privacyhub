import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PrivacyAnalysis } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  analysis?: PrivacyAnalysis;
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  title = 'Privacy Policy Analyzer & Compliance Score Tool | PrivacyHub.in',
  description = 'Discover our AI-driven privacy policy analyzer that evaluates website privacy practices and compliance. Get a detailed compliance score, actionable insights, and expert recommendations.',
  canonicalUrl = 'https://privacyhub.in',
  analysis
}) => {
  // Generate structured data for analysis pages
  const generateStructuredData = (analysis: PrivacyAnalysis) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `${analysis.siteName} Privacy Policy Analysis`,
      description: analysis.summary,
      datePublished: analysis.analysisDate,
      dateModified: new Date(analysis.lastUpdated || analysis.analysisDate).toISOString(),
      author: {
        '@type': 'Organization',
        name: 'PrivacyHub.in',
        url: 'https://privacyhub.in'
      },
      publisher: {
        '@type': 'Organization',
        name: 'PrivacyHub.in',
        logo: {
          '@type': 'ImageObject',
          url: 'https://privacyhub.in/logo.png'
        }
      },
      image: analysis.screenshotUrl,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://privacyhub.in/analysis/${analysis.brandName?.toLowerCase().replace(/\s+/g, '-')}`
      }
    };
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={analysis ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      {analysis && <meta property="og:image" content={analysis.screenshotUrl} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {analysis && <meta name="twitter:image" content={analysis.screenshotUrl} />}

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="PrivacyHub.in" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Structured Data */}
      {analysis && (
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData(analysis))}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;