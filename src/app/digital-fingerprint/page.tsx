import type { Metadata } from "next";
import { BrowserDataExposureEnhanced } from '@/components/BrowserDataExposureEnhanced';

export const metadata: Metadata = {
  title: "Your Digital Fingerprint Analysis | PrivacyHub.in",
  description: "Discover your unique digital fingerprint and learn what information websites can automatically collect about you. Comprehensive privacy awareness tool with 500+ data points analysis.",
  keywords: "digital fingerprint, browser fingerprinting, privacy analysis, online tracking, device fingerprinting, privacy awareness",
  openGraph: {
    title: "Your Digital Fingerprint Analysis | PrivacyHub.in",
    description: "Comprehensive digital fingerprint analysis tool that reveals 500+ data points about your device",
    type: "website",
    url: "https://privacyhub.in/digital-fingerprint",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Digital Fingerprint Analysis | PrivacyHub.in",
    description: "Comprehensive digital fingerprint analysis tool that reveals 500+ data points about your device",
  },
};

export default function DigitalFingerprintPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-800 bg-clip-text text-transparent mb-6">
            What Data Your Browser Is Leaking
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
            Discover what information websites can automatically collect about you without your explicit permission. 
            This educational tool reveals your digital fingerprint while keeping your data completely private.
          </p>
          
          {/* Privacy Guarantee */}
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-green-800">Your Privacy is Protected</span>
            </div>
            <p className="text-green-700">
              <strong>Nothing is stored, saved, or shared.</strong> All analysis happens locally in your browser 
              and is discarded when you close this tab.
            </p>
          </div>
        </div>
      </section>
      
      {/* Browser Data Exposure Tool */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BrowserDataExposure />
        </div>
      </section>

      {/* Educational Context */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Understanding Browser Fingerprinting
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Browser fingerprinting is a tracking technique that websites use to identify and track users 
              across the web without cookies or other traditional tracking methods.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Data Collection</h4>
                    <p className="text-gray-600">Websites automatically collect information about your browser, device, and settings without asking permission.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Unique Fingerprint</h4>
                    <p className="text-gray-600">The combination of all collected data points creates a unique &quot;fingerprint&quot; that can identify you across different websites.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Cross-Site Tracking</h4>
                    <p className="text-gray-600">Your fingerprint can be used to track your browsing behavior across different websites and build detailed profiles.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why It Matters</h3>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">Privacy Invasion</h4>
                  <p className="text-orange-800 text-sm">Your browsing habits, interests, and behavior patterns can be monitored without your knowledge or consent.</p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Persistent Tracking</h4>
                  <p className="text-red-800 text-sm">Unlike cookies, browser fingerprints are much harder to block or delete, making tracking more persistent.</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Data Monetization</h4>
                  <p className="text-purple-800 text-sm">Your personal data and browsing patterns become valuable commodities sold to advertisers and data brokers.</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Discrimination Risk</h4>
                  <p className="text-blue-800 text-sm">Detailed profiles can lead to price discrimination, content filtering, and unfair treatment based on your digital identity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}