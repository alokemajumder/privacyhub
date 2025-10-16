'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Calculator, Scale, Shield, Users, Lock, Eye, FileText, Info } from 'lucide-react';

export function MethodologySection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    {
      name: 'Data Minimization & Collection',
      weight: 30,
      icon: <Shield className="h-5 w-5" />,
      description: 'Evaluates data collection scope, legal basis clarity, purpose specification, and sensitive data handling per GDPR, CCPA, and DPDP Act 2023',
      criteria: [
        'Collection limited to necessary data for stated purposes',
        'Clear lawful basis identification (GDPR Art. 6, DPDP Act Sec. 6)',
        'Specific vs. vague purpose statements',
        'Special category data protections (GDPR Art. 9, DPDP Act Sec. 9)',
        'Children\'s data compliance (COPPA/GDPR-K/DPDP Act Sec. 9)',
        'Notice and consent mechanisms per DPDP Act requirements'
      ]
    },
    {
      name: 'Third-Party Data Sharing',
      weight: 25,
      icon: <Users className="h-5 w-5" />,
      description: 'Assesses data controller/processor relationships and international transfer mechanisms per GDPR Chapter V and DPDP Act requirements',
      criteria: [
        'Sharing scope and commercial exploitation',
        'International transfer compliance (SCCs/BCRs, DPDP Act Sec. 16)',
        'Data processor agreements (GDPR Art. 28, DPDP Act Sec. 8)',
        'Granular consent mechanisms',
        'User awareness of data monetization',
        'Cross-border transfer compliance with DPDP Act restricted countries'
      ]
    },
    {
      name: 'Individual Rights & Controls',
      weight: 20,
      icon: <Scale className="h-5 w-5" />,
      description: 'Evaluates GDPR Chapter III and DPDP Act Chapter IV rights implementation and user control mechanisms',
      criteria: [
        'Data access rights (GDPR Art. 15, DPDP Act Sec. 11)',
        'Rectification processes (GDPR Art. 16, DPDP Act Sec. 12)',
        'Right to be forgotten/deletion (GDPR Art. 17, DPDP Act Sec. 12)',
        'Data portability (GDPR Art. 20)',
        'Objection and opt-out mechanisms',
        'Withdrawal of consent (DPDP Act Sec. 7)',
        'Grievance redressal mechanisms (DPDP Act Sec. 32)'
      ]
    },
    {
      name: 'Security & Risk Management',
      weight: 15,
      icon: <Lock className="h-5 w-5" />,
      description: 'Technical and organizational measures assessment per GDPR Art. 32 and DPDP Act Sec. 8',
      criteria: [
        'Encryption standards (end-to-end, in-transit, at-rest)',
        'Access controls and multi-factor authentication',
        'Incident response (72-hour GDPR/DPDP Act requirement)',
        'Privacy impact assessments',
        'Data retention and deletion schedules',
        'Data localization compliance (DPDP Act)'
      ]
    },
    {
      name: 'Regulatory Compliance',
      weight: 7,
      icon: <FileText className="h-5 w-5" />,
      description: 'Multi-jurisdictional compliance evaluation across global privacy frameworks',
      criteria: [
        'GDPR compliance indicators (EU users)',
        'CCPA compliance markers (California residents)',
        'DPDP Act 2023 compliance (Indian users)',
        'Sectoral compliance (HIPAA, FERPA, GLBA)',
        'Privacy officer/DPO designation',
        'Data Protection Board registration (DPDP Act Sec. 25)'
      ]
    },
    {
      name: 'Transparency & Communication',
      weight: 3,
      icon: <Eye className="h-5 w-5" />,
      description: 'Information quality and accessibility assessment including DPDP Act transparency requirements',
      criteria: [
        'Plain language usage (Flesch-Kincaid readability)',
        'Layered notices and mobile optimization',
        'Proactive change notifications',
        'Dedicated privacy contact/DPO information',
        'Grievance officer details (DPDP Act requirement)',
        'Vernacular language support'
      ]
    }
  ];

  const riskLevels = [
    { level: 'EXEMPLARY (9-10)', color: 'bg-green-100 text-green-800', description: 'Privacy-by-design implementation, exceeds regulatory minimums' },
    { level: 'LOW RISK (8-9)', color: 'bg-blue-100 text-blue-800', description: 'Strong privacy framework with minor gaps' },
    { level: 'MODERATE (6-7)', color: 'bg-yellow-100 text-yellow-800', description: 'Some privacy protections present, areas for improvement' },
    { level: 'MODERATE-HIGH (4-5)', color: 'bg-orange-100 text-orange-800', description: 'Multiple compliance gaps, user privacy compromised' },
    { level: 'HIGH RISK (1-3)', color: 'bg-red-100 text-red-800', description: 'Significant privacy violations likely, regulatory action probable' }
  ];

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-blue-900">Analysis Methodology</h4>
              <p className="text-sm text-blue-700">Evidence-based privacy assessment framework</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-700 hover:bg-blue-100"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>

        {/* Quick Overview */}
        <div className="mb-6">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-blue-700">Assessment Categories</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">90+</div>
              <div className="text-sm text-blue-700">Privacy Criteria</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-blue-700">Risk Levels</div>
            </div>
          </div>

          {/* Category Weights Overview */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h5 className="font-semibold text-blue-900 mb-3">Weighted Scoring Framework</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">{category.name}</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    {category.weight}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Methodology */}
        {isExpanded && (
          <div className="space-y-6">
            {/* Scoring Categories */}
            <div>
              <h5 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Assessment Categories
              </h5>
              <div className="grid gap-4">
                {categories.map((category, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded">
                          {category.icon}
                        </div>
                        <div>
                          <h6 className="font-semibold text-blue-900">{category.name}</h6>
                          <p className="text-sm text-blue-700">{category.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {category.weight}% Weight
                      </Badge>
                    </div>
                    <div className="ml-11">
                      <p className="text-xs text-blue-600 mb-2">Key Evaluation Criteria:</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        {category.criteria.map((criterion, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            {criterion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Classification */}
            <div>
              <h5 className="text-lg font-semibold text-blue-900 mb-4">Risk Classification System</h5>
              <div className="space-y-2">
                {riskLevels.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-blue-200">
                    <Badge className={`${risk.color} font-medium`}>
                      {risk.level}
                    </Badge>
                    <span className="text-sm text-blue-700 flex-1 ml-4">{risk.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory Framework */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h5 className="text-lg font-semibold text-blue-900 mb-3">Regulatory Framework</h5>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h6 className="font-medium text-blue-800 mb-2">Primary Regulations</h6>
                  <ul className="space-y-1 text-blue-700">
                    <li>• GDPR (General Data Protection Regulation)</li>
                    <li>• CCPA (California Consumer Privacy Act)</li>
                    <li>• DPDP Act 2023 (Digital Personal Data Protection Act, India)</li>
                    <li>• PIPEDA (Personal Information Protection Act)</li>
                    <li>• COPPA (Children&apos;s Online Privacy Protection Act)</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium text-blue-800 mb-2">Industry Standards</h6>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Privacy-by-Design Principles</li>
                    <li>• ISO/IEC 27001 Security Framework</li>
                    <li>• NIST Privacy Framework</li>
                    <li>• Fair Information Practice Principles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}