import type { Metadata } from "next";
import { AnalysisHistory } from '@/components/AnalysisHistory';

export const metadata: Metadata = {
  title: "Analysis History | PrivacyHub.in",
  description: "View your privacy policy analysis history and community insights. Track privacy scores, grades, and compliance trends across analyzed websites.",
  keywords: "privacy analysis history, privacy scores, GDPR compliance, privacy policy tracking, analysis trends",
  openGraph: {
    title: "Analysis History | PrivacyHub.in",
    description: "View your privacy policy analysis history and community insights",
    type: "website",
    url: "https://privacyhub.in/history",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analysis History | PrivacyHub.in",
    description: "View your privacy policy analysis history and community insights",
  },
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Analysis History
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
            Track privacy policy analyses, monitor compliance trends, and discover insights from the 
            community&apos;s privacy assessments across the web.
          </p>
          
          {/* Stats Preview */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-blue-700">Analyses Completed</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-indigo-200">
              <div className="text-2xl font-bold text-indigo-600">7.2</div>
              <div className="text-indigo-700">Average Score</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">150+</div>
              <div className="text-purple-700">Unique Websites</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Analysis History Component */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnalysisHistory />
        </div>
      </section>

      {/* Community Insights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Community Privacy Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Learn from aggregated privacy analysis data to understand how different 
              industries and websites handle user privacy.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-green-900 mb-4">Best Performers</h3>
              <p className="text-green-800 mb-4">Websites leading in privacy protection</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Privacy-focused tech companies</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Educational institutions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Healthcare providers</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-xl font-bold text-yellow-900 mb-4">Areas for Improvement</h3>
              <p className="text-yellow-800 mb-4">Common privacy policy weaknesses</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Vague data collection purposes</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Unclear third-party sharing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Limited user control options</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <h3 className="text-xl font-bold text-red-900 mb-4">High Risk Categories</h3>
              <p className="text-red-800 mb-4">Industries with concerning practices</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Social media platforms</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Data brokers</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Free online services</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}