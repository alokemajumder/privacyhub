'use client';

import React from 'react';
import { Github, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PrivacyAnalyzer from '@/components/PrivacyAnalyzer';
import { AnalysisHistory } from '@/components/AnalysisHistory';
import { MethodologySection } from '@/components/MethodologySection';
import { BrowserDataExposure } from '@/components/BrowserDataExposure';
import { SupportSection } from '@/components/SupportSection';

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

      {/* Browser Data Exposure Section */}
      <section id="browser-exposure" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
              What Data Your Browser Is Leaking
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover what information websites can automatically collect about you without your explicit permission. 
              This educational tool reveals your digital fingerprint. <strong className="text-green-600">Your data stays private</strong> - 
              nothing is stored, saved, or shared. Everything is analyzed locally and discarded when you close the tab.
            </p>
          </div>
          <BrowserDataExposure />
        </div>
      </section>

      {/* Analysis History Section */}
      <section id="history" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnalysisHistory />
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Our Analysis Methodology
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Professional privacy assessment using evidence-based evaluation framework with regulatory compliance standards.
            </p>
          </div>
          <MethodologySection />
        </div>
      </section>

      {/* Support Section */}
      <section id="donate" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Keep Privacy Analysis Free
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Help us maintain this free privacy service by supporting our infrastructure costs. 
              Every contribution keeps privacy analysis accessible to everyone.
            </p>
          </div>
          <SupportSection />
        </div>
      </section>
      
      {/* About Privacy Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 lg:p-12">
              <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Why Privacy Analysis Matters
              </h2>
              <p className="text-xl text-gray-600 mb-12 text-center max-w-4xl mx-auto leading-relaxed">
                In today&apos;s digital age, your personal data is more valuable—and vulnerable—than ever. 
                Understanding how websites handle your information is crucial for maintaining your privacy and security online.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Key Privacy Concerns</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Personal data collection and storage practices",
                      "Third-party data sharing agreements", 
                      "Targeted advertising and user profiling",
                      "Data breach notification policies",
                      "Long-term data retention periods"
                    ].map((concern, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Potential User Impact</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Identity theft and financial fraud risks",
                      "Manipulation through targeted content",
                      "Unauthorized financial exploitation", 
                      "Loss of personal autonomy and choice",
                      "Invasive behavioral surveillance"
                    ].map((impact, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="text-center p-8 bg-blue-50 rounded-2xl">
                <p className="text-lg text-blue-900 max-w-4xl mx-auto leading-relaxed">
                  Privacy policies are your window into how companies handle your personal information. 
                  By understanding these policies, you can make informed decisions about which services to trust 
                  with your data and how to protect your privacy online.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Open Source Contribution Section */}
          <Card className="mt-12 border-0 shadow-xl">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Source Contribution</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  PrivacyHub.in is an open source project dedicated to improving privacy transparency across the web.
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    We believe in the power of community collaboration to create more effective privacy tools for everyone. 
                    By contributing to PrivacyHub, you&apos;re helping build a more privacy-conscious internet where users 
                    can better understand how their data is being used and protected.
                  </p>
                  <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <a 
                      href="https://github.com/privacypriority/privacyhub" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <Github className="h-5 w-5" />
                      <span>Contribute on GitHub</span>
                    </a>
                  </Button>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Ways to Contribute</h4>
                  <ul className="space-y-4">
                    {[
                      "Improve AI analysis algorithms for more accurate privacy policy scoring",
                      "Enhance the policy detection system to better locate privacy policies", 
                      "Add support for additional languages and regional privacy regulations",
                      "Develop browser extensions for instant privacy policy analysis",
                      "Report bugs and suggest new features to improve user experience"
                    ].map((way, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Badge className="bg-blue-100 text-blue-800 mt-1">{index + 1}</Badge>
                        <span className="text-gray-700">{way}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
