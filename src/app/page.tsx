'use client';

import React from 'react';
import { Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PrivacyAnalyzer from '@/components/PrivacyAnalyzer';
import { AnalysisHistory } from '@/components/AnalysisHistory';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl lg:text-6xl font-bold gradient-text mb-6 font-display">
          Privacy Policy Analyzer
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Understand how websites handle your personal data. Get detailed analysis, scoring, and recommendations 
          for any privacy policy in seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            AI-Powered Analysis
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            90+ Privacy Criteria
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Community Database
          </Badge>
        </div>
      </div>
      
      {/* Privacy Analyzer */}
      <div className="mb-16">
        <PrivacyAnalyzer />
      </div>

      {/* Analysis History */}
      <div className="mb-16">
        <AnalysisHistory />
      </div>
      
      {/* Why Online Privacy Matters Section */}
      <div className="mt-20">
        <Card>
          <CardContent className="p-8 lg:p-10">
            <h3 className="text-3xl font-bold text-foreground mb-6 text-center font-display">
              Why Privacy Analysis Matters
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground text-lg mb-6 text-center max-w-4xl mx-auto">
                In today&apos;s digital age, your personal data is more valuable—and vulnerable—than ever. Every website you visit, app you use, and service you sign up for collects data about you. Understanding how this data is collected, used, and protected is crucial for maintaining your privacy and security online.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-4 font-display">Key Privacy Concerns</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Personal data collection and storage practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Third-party data sharing agreements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Targeted advertising and user profiling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Data breach notification policies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Long-term data retention periods</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-4 font-display">Potential Impact on Users</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Identity theft and financial fraud risks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Manipulation through targeted content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Unauthorized financial exploitation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Loss of personal autonomy and choice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Invasive behavioral surveillance</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-muted-foreground text-lg text-center max-w-4xl mx-auto">
                Privacy policies are your window into how companies handle your personal information. By understanding these policies, you can make informed decisions about which services to trust with your data and how to protect your privacy online.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Open Source Contribution Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Open Source Contribution</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  PrivacyHub is an open source project dedicated to improving privacy transparency across the web. We believe in the power of community collaboration to create more effective privacy tools for everyone.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By contributing to PrivacyHub, you&apos;re helping build a more privacy-conscious internet where users can better understand how their data is being used and protected.
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <Button variant="outline" asChild>
                    <a 
                      href="https://github.com/privacypriority/privacyhub" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <Github className="h-4 w-4" />
                      <span>View on GitHub</span>
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-3">Ways to Contribute</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <Badge className="mr-2 mt-0.5">1</Badge>
                    <span>Improve AI analysis algorithms for more accurate privacy policy scoring</span>
                  </li>
                  <li className="flex items-start">
                    <Badge className="mr-2 mt-0.5">2</Badge>
                    <span>Enhance the policy detection system to better locate privacy policies on websites</span>
                  </li>
                  <li className="flex items-start">
                    <Badge className="mr-2 mt-0.5">3</Badge>
                    <span>Add support for additional languages and regional privacy regulations</span>
                  </li>
                  <li className="flex items-start">
                    <Badge className="mr-2 mt-0.5">4</Badge>
                    <span>Develop browser extensions for instant privacy policy analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Badge className="mr-2 mt-0.5">5</Badge>
                    <span>Report bugs and suggest new features to improve user experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
