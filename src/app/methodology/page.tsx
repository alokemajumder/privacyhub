import type { Metadata } from "next";
import { MethodologySection } from '@/components/MethodologySection';

export const metadata: Metadata = {
  title: "Analysis Methodology | PrivacyHub.in",
  description: "Learn about our evidence-based privacy assessment framework with regulatory compliance standards, 90+ privacy criteria, and professional scoring methodology.",
  keywords: "privacy analysis methodology, GDPR compliance, CCPA assessment, privacy scoring, regulatory compliance, privacy framework",
  openGraph: {
    title: "Analysis Methodology | PrivacyHub.in",
    description: "Evidence-based privacy assessment framework with regulatory compliance standards",
    type: "website",
    url: "https://privacyhub.in/methodology",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analysis Methodology | PrivacyHub.in",
    description: "Evidence-based privacy assessment framework with regulatory compliance standards",
  },
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            Our Analysis Methodology
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
            Professional privacy assessment using evidence-based evaluation framework with regulatory 
            compliance standards. Transparent, scientific, and designed to provide actionable insights.
          </p>
          
          {/* Key Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-blue-700">Assessment Categories</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-indigo-200">
              <div className="text-2xl font-bold text-indigo-600">90+</div>
              <div className="text-indigo-700">Privacy Criteria</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-purple-700">Risk Levels</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Methodology Details */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <MethodologySection />
        </div>
      </section>

      {/* Scientific Approach */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Scientific Assessment Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our methodology is grounded in academic research, legal frameworks, and industry best practices.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Evidence-Based Framework</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Regulatory Compliance</h4>
                  <p className="text-gray-600">
                    Analysis criteria directly map to GDPR Articles, CCPA requirements, and other privacy regulations. 
                    Each assessment point is traceable to specific legal obligations.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Academic Research</h4>
                  <p className="text-gray-600">
                    Methodology incorporates findings from privacy research, user studies, and data protection 
                    best practices published in peer-reviewed journals.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Industry Standards</h4>
                  <p className="text-gray-600">
                    Evaluation criteria align with ISO/IEC 27001, NIST Privacy Framework, and Privacy-by-Design 
                    principles recognized by data protection authorities.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Objective Scoring System</h3>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">Weighted Categories</h4>
                  <p className="text-blue-800 mb-4">
                    Each category receives a weight based on its impact on user privacy and regulatory importance:
                  </p>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Data Minimization: 30% (highest impact)</li>
                    <li>• Third-Party Sharing: 25% (commercial risk)</li>
                    <li>• Individual Rights: 20% (user empowerment)</li>
                    <li>• Security Measures: 15% (protection quality)</li>
                    <li>• Regulatory Compliance: 7% (legal adherence)</li>
                    <li>• Transparency: 3% (communication quality)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Scoring Algorithm</h4>
                  <p className="text-gray-700 text-sm">
                    Each criterion receives a score from 0-10. Category scores are calculated as weighted averages, 
                    then combined using the category weights to produce the overall privacy score (0-10 scale).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continuous Improvement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Continuous Improvement
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our methodology evolves with changing regulations, privacy research, and community feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regular Updates</h3>
              <p className="text-gray-600">
                Methodology updated quarterly to reflect new regulations, court decisions, and research findings.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Review</h3>
              <p className="text-gray-600">
                Privacy researchers and legal experts review methodology changes before implementation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Input</h3>
              <p className="text-gray-600">
                Analysis results and methodology improvements informed by user feedback and real-world usage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}