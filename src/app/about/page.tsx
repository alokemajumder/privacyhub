import type { Metadata } from "next";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Github, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Privacy Analysis | PrivacyHub.in",
  description: "Learn why privacy policy analysis matters in today's digital age. Understand privacy concerns, user impact, and how PrivacyHub helps protect your digital rights.",
  keywords: "privacy policy analysis, digital privacy, data protection, user privacy rights, online privacy awareness",
  openGraph: {
    title: "About Privacy Analysis | PrivacyHub.in",
    description: "Learn why privacy policy analysis matters in today's digital age",
    type: "website",
    url: "https://privacyhub.in/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Privacy Analysis | PrivacyHub.in",
    description: "Learn why privacy policy analysis matters in today's digital age",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Why Privacy Analysis Matters
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
            In today&apos;s digital age, your personal data is more valuable—and vulnerable—than ever. 
            Understanding how websites handle your information is crucial for maintaining your privacy and security online.
          </p>
          
          {/* Key Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-red-200">
              <div className="text-2xl font-bold text-red-600">87%</div>
              <div className="text-red-700">Users Don&apos;t Read Policies</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">15+</div>
              <div className="text-orange-700">Hours to Read All Policies</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">1000+</div>
              <div className="text-blue-700">Companies Track You Daily</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Privacy Concerns and Impact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 lg:p-12">
              <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                The Digital Privacy Crisis
              </h2>
              <p className="text-xl text-gray-600 mb-12 text-center max-w-4xl mx-auto leading-relaxed">
                Every day, you share personal information with dozens of websites and services. 
                Most privacy policies are deliberately complex, hiding concerning practices behind legal jargon.
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
        </div>
      </section>

      {/* How PrivacyHub Helps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How PrivacyHub Helps
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We make privacy policies understandable, giving you the power to make informed decisions 
              about your digital privacy.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">Automated Analysis</h3>
              <p className="text-blue-800 text-center">
                Our AI analyzes complex privacy policies in seconds, extracting key information 
                about data practices, sharing, and user rights.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-4 text-center">Clear Scoring</h3>
              <p className="text-green-800 text-center">
                Every policy gets a clear privacy score and grade, making it easy to understand 
                how well a company protects your personal information.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">Actionable Insights</h3>
              <p className="text-purple-800 text-center">
                Get specific recommendations about privacy risks, regulatory compliance, 
                and steps you can take to protect yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Source Privacy Protection</h2>
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

      {/* Privacy Principles */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Privacy Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We practice what we preach. PrivacyHub is built with privacy-first principles 
              and transparent practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-green-900 mb-4">What We Do</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-green-800">Analyze privacy policies to help users</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-green-800">Store analysis results for community benefit</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-green-800">Maintain transparent methodology</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-green-800">Open source all our code</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-8 border border-red-200">
              <h3 className="text-2xl font-bold text-red-900 mb-4">What We Don&apos;t Do</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-red-800">Track users across websites</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-red-800">Sell personal data to third parties</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-red-800">Use invasive analytics or ads</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-red-800">Store unnecessary personal information</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-50 rounded-xl p-8 border border-blue-200 inline-block">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-blue-900">Made with Privacy in Mind</span>
              </div>
              <p className="text-blue-800 max-w-2xl">
                PrivacyHub demonstrates that powerful web services can be built without compromising user privacy. 
                We hope to inspire other projects to adopt similar privacy-respecting practices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}