import type { Metadata } from "next";
import { SupportSection } from '@/components/SupportSection';

export const metadata: Metadata = {
  title: "Support PrivacyHub | Keep Privacy Analysis Free",
  description: "Help maintain PrivacyHub as a free privacy service by supporting our infrastructure costs. Transparent funding for Firecrawl, OpenRouter, and Vercel hosting.",
  keywords: "support privacy tools, donate privacy analysis, open source privacy, infrastructure costs, privacy funding",
  openGraph: {
    title: "Support PrivacyHub | Keep Privacy Analysis Free",
    description: "Help maintain PrivacyHub as a free privacy service by supporting our infrastructure costs",
    type: "website",
    url: "https://privacyhub.in/support",
  },
  twitter: {
    card: "summary_large_image",
    title: "Support PrivacyHub | Keep Privacy Analysis Free",
    description: "Help maintain PrivacyHub as a free privacy service by supporting our infrastructure costs",
  },
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Keep Privacy Analysis Free
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
            Help us maintain this free privacy service by supporting our infrastructure costs. 
            Every contribution keeps privacy analysis accessible to everyone, protecting digital rights worldwide.
          </p>
          
          {/* Impact Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-blue-700">Analyses Completed</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-purple-700">Free & Open Source</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-pink-200">
              <div className="text-2xl font-bold text-pink-600">0</div>
              <div className="text-pink-700">Ads or Tracking</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SupportSection />
        </div>
      </section>

      {/* Why Support Matters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Your Support Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Privacy is a fundamental right, but understanding privacy policies shouldn&apos;t require 
              a law degree. Your support helps democratize privacy awareness.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Universal Access</h4>
                    <p className="text-gray-600">
                      Privacy analysis should be free and accessible to everyone, regardless of technical 
                      background or financial resources.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Education First</h4>
                    <p className="text-gray-600">
                      Empower users with knowledge about their digital rights and how companies handle 
                      their personal information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Transparency</h4>
                    <p className="text-gray-600">
                      Open source methodology and complete transparency about how we assess privacy policies 
                      and handle user data.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Impact of Support</h3>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">Immediate Impact</h4>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Keep the service running 24/7</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Process more analyses per day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Maintain fast response times</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 className="text-lg font-semibold text-green-900 mb-3">Long-term Goals</h4>
                  <ul className="space-y-2 text-green-800">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Browser extensions for real-time analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Mobile apps for privacy on-the-go</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Multi-language support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join Our Privacy Community
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Beyond financial support, join thousands of privacy advocates working to create a more 
            transparent and privacy-respecting internet.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contribute Code</h3>
              <p className="text-gray-600 mb-4">
                Help improve our analysis algorithms, add new features, or fix bugs on GitHub.
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View Open Issues →
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Spread Awareness</h3>
              <p className="text-gray-600 mb-4">
                Share PrivacyHub with friends, family, and on social media to help others protect their privacy.
              </p>
              <button className="text-green-600 hover:text-green-700 font-medium">
                Share Now →
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Provide Feedback</h3>
              <p className="text-gray-600 mb-4">
                Report bugs, suggest features, or share your experience to help us improve the service.
              </p>
              <button className="text-purple-600 hover:text-purple-700 font-medium">
                Give Feedback →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}