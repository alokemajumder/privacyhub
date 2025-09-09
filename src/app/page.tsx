'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PrivacyAnalyzer from '@/components/PrivacyAnalyzer';
import { AnalysisHistoryCards } from '@/components/AnalysisHistoryCards';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
            Privacy Policy Analyzer
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
            Professional AI-powered analysis of privacy policies with comprehensive scoring, 
            regulatory compliance checks, and actionable recommendations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="outline" className="gap-2 px-4 py-2 bg-white/80 backdrop-blur">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              AI-Powered Analysis
            </Badge>
            <Badge variant="outline" className="gap-2 px-4 py-2 bg-white/80 backdrop-blur">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              90+ Privacy Criteria
            </Badge>
            <Badge variant="outline" className="gap-2 px-4 py-2 bg-white/80 backdrop-blur">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              GDPR & CCPA Compliance
            </Badge>
            <Badge variant="outline" className="gap-2 px-4 py-2 bg-white/80 backdrop-blur">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Community Supported
            </Badge>
          </div>
        </div>
      </section>
      
      {/* Privacy Analyzer Section */}
      <section id="analyzer" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <PrivacyAnalyzer />
        </div>
      </section>

      {/* Analysis History Cards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <AnalysisHistoryCards />
        </div>
      </section>
      
      {/* Quick Links Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Explore PrivacyHub
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover more privacy tools and resources to protect your digital rights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-red-600 rounded-full"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Digital Fingerprint</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  See what information your browser reveals to websites automatically.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/digital-fingerprint">Explore →</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Analysis History</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  View privacy analysis results and community insights.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/history">View History →</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Our Methodology</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Learn how our privacy assessment framework works.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/methodology">Learn More →</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Support Us</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Help keep privacy analysis free for everyone.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/support">Support →</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
