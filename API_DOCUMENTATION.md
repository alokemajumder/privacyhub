# PrivacyHub API Documentation

REST API for privacy policy analysis powered by AI.

## Base URL

```
Production: https://privacyhub.in/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

Currently, the API is open and does not require authentication.

## Endpoints

### POST /analyzer

Analyze a privacy policy URL and get comprehensive privacy assessment.

**Endpoint:** `/api/v1/analyzer`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://example.com/privacy-policy"
}
```

**Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| url       | string | Yes      | Full URL to the privacy policy page |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "url": "https://example.com/privacy-policy",
    "timestamp": "2025-10-16T10:30:00.000Z",
    "scraper_used": "firecrawl",
    "content_length": 15234,
    "analysis": {
      "overall_score": 7.2,
      "privacy_grade": "B",
      "risk_level": "MODERATE",
      "executive_summary": "The privacy policy demonstrates moderate privacy protections with some areas requiring improvement, particularly in user rights implementation and third-party data sharing transparency.",
      "regulatory_compliance": {
        "gdpr_compliance": "PARTIALLY_COMPLIANT",
        "ccpa_compliance": "COMPLIANT",
        "dpdp_act_compliance": "PARTIALLY_COMPLIANT",
        "major_violations": [
          "Unclear data retention periods",
          "Missing grievance redressal mechanism"
        ]
      },
      "categories": {
        "data_collection": {
          "score": 7.5,
          "reasoning": "Clear purpose specification and legal basis, but collects more data than necessary",
          "regulatory_notes": "GDPR Art. 5(1)(c) compliance - moderate"
        },
        "data_sharing": {
          "score": 6.0,
          "reasoning": "Extensive third-party sharing without granular consent options",
          "regulatory_notes": "GDPR Ch. V and DPDP Act Sec. 16 - partial compliance"
        },
        "user_rights": {
          "score": 6.5,
          "reasoning": "Basic access and deletion rights, but missing portability features",
          "regulatory_notes": "GDPR Art. 15-17 implemented, Art. 20 missing"
        },
        "security_measures": {
          "score": 8.0,
          "reasoning": "Strong encryption and access controls mentioned",
          "regulatory_notes": "GDPR Art. 32 compliant"
        },
        "compliance_framework": {
          "score": 7.0,
          "reasoning": "Multiple regulatory frameworks addressed",
          "regulatory_notes": "GDPR, CCPA addressed; DPDP Act partially"
        },
        "transparency": {
          "score": 7.5,
          "reasoning": "Clear language with some technical jargon",
          "regulatory_notes": "Readability good, contact info present"
        }
      },
      "critical_findings": {
        "high_risk_practices": [
          "Automatic opt-in to marketing without explicit consent",
          "Indefinite data retention without clear deletion schedule"
        ],
        "regulatory_gaps": [
          "Missing DPDP Act Sec. 32 grievance officer details",
          "No clear data portability mechanism (GDPR Art. 20)"
        ],
        "data_subject_impacts": [
          "Users cannot easily withdraw consent for specific data processing",
          "Unclear how long personal data is retained"
        ]
      },
      "positive_practices": [
        "Clear cookie consent mechanism",
        "Strong encryption standards mentioned",
        "Dedicated privacy contact email provided"
      ],
      "actionable_recommendations": {
        "immediate_actions": [
          "Implement granular consent mechanisms for third-party sharing",
          "Add clear data retention periods for all data categories",
          "Designate grievance officer per DPDP Act Sec. 32"
        ],
        "medium_term_improvements": [
          "Develop data portability feature (GDPR Art. 20)",
          "Implement automated consent withdrawal system",
          "Conduct privacy impact assessment"
        ],
        "best_practice_adoption": [
          "Consider privacy-by-design principles",
          "Implement differential privacy techniques",
          "Provide vernacular language support"
        ]
      }
    }
  }
}
```

**Error Response (400 - Bad Request):**

```json
{
  "success": false,
  "error": "Invalid URL",
  "message": "The provided URL is not valid"
}
```

**Error Response (500 - Internal Server Error):**

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Analysis failed. Please try again or contact support."
}
```

**Error Response (504 - Gateway Timeout):**

```json
{
  "success": false,
  "error": "Timeout",
  "message": "Request timed out. The website may be slow or unresponsive."
}
```

## Rate Limiting

Currently, there are no rate limits enforced. This may change in future versions.

## Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid URL or malformed request |
| 429 | Too Many Requests | Rate limit exceeded (if enabled) |
| 500 | Internal Server Error | Server-side error during analysis |
| 504 | Gateway Timeout | Request timed out |

## Analysis Categories

The API evaluates privacy policies across 6 weighted categories:

1. **Data Minimization & Collection (30%)** - Data collection scope, legal basis, purpose specification
2. **Third-Party Data Sharing (25%)** - Sharing scope, international transfers, consent mechanisms
3. **Individual Rights & Controls (20%)** - Access, rectification, erasure, portability rights
4. **Security & Risk Management (15%)** - Encryption, access controls, incident response
5. **Regulatory Compliance (7%)** - GDPR, CCPA, DPDP Act compliance
6. **Transparency & Communication (3%)** - Language clarity, accessibility

## Privacy Grades

| Grade | Score Range | Risk Level | Description |
|-------|-------------|------------|-------------|
| A+ | 9.5-10 | EXEMPLARY | Privacy-by-design implementation, exceeds regulatory minimums |
| A | 9.0-9.4 | EXEMPLARY | Excellent privacy protections |
| B+ | 8.5-8.9 | LOW RISK | Strong privacy framework |
| B | 8.0-8.4 | LOW RISK | Good privacy practices |
| C+ | 7.5-7.9 | MODERATE | Adequate privacy protections |
| C | 6.5-7.4 | MODERATE | Some privacy protections present |
| D | 5.5-6.4 | MODERATE-HIGH | Multiple compliance gaps |
| E | 4.0-5.4 | MODERATE-HIGH | User privacy compromised |
| F | 1.0-3.9 | HIGH RISK | Significant privacy violations likely |

## Examples

### cURL Example

```bash
curl -X POST https://privacyhub.in/api/v1/analyzer \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.example.com/privacy"
  }'
```

### JavaScript/Fetch Example

```javascript
const analyzePrivacyPolicy = async (url) => {
  const response = await fetch('https://privacyhub.in/api/v1/analyzer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url })
  });

  const data = await response.json();

  if (data.success) {
    console.log('Privacy Score:', data.data.analysis.overall_score);
    console.log('Grade:', data.data.analysis.privacy_grade);
    console.log('Risk Level:', data.data.analysis.risk_level);
    return data.data.analysis;
  } else {
    console.error('Error:', data.message);
    throw new Error(data.message);
  }
};

// Usage
analyzePrivacyPolicy('https://example.com/privacy-policy')
  .then(analysis => console.log(analysis))
  .catch(error => console.error(error));
```

### Python Example

```python
import requests
import json

def analyze_privacy_policy(url):
    api_url = "https://privacyhub.in/api/v1/analyzer"

    payload = {"url": url}
    headers = {"Content-Type": "application/json"}

    response = requests.post(api_url, json=payload, headers=headers)
    data = response.json()

    if data.get("success"):
        analysis = data["data"]["analysis"]
        print(f"Privacy Score: {analysis['overall_score']}")
        print(f"Grade: {analysis['privacy_grade']}")
        print(f"Risk Level: {analysis['risk_level']}")
        return analysis
    else:
        print(f"Error: {data.get('message')}")
        raise Exception(data.get('message'))

# Usage
analysis = analyze_privacy_policy("https://example.com/privacy-policy")
print(json.dumps(analysis, indent=2))
```

### Node.js/Axios Example

```javascript
const axios = require('axios');

async function analyzePrivacyPolicy(url) {
  try {
    const response = await axios.post('https://privacyhub.in/api/v1/analyzer', {
      url: url
    });

    if (response.data.success) {
      const analysis = response.data.data.analysis;
      console.log('Privacy Score:', analysis.overall_score);
      console.log('Grade:', analysis.privacy_grade);
      console.log('Risk Level:', analysis.risk_level);
      return analysis;
    }
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data.message);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Usage
analyzePrivacyPolicy('https://example.com/privacy-policy')
  .then(analysis => console.log(JSON.stringify(analysis, null, 2)))
  .catch(error => console.error(error));
```

## Regulatory Frameworks

The API analyzes privacy policies against multiple regulatory frameworks:

- **GDPR** (General Data Protection Regulation) - EU
- **CCPA** (California Consumer Privacy Act) - California, USA
- **DPDP Act 2023** (Digital Personal Data Protection Act) - India
- **PIPEDA** (Personal Information Protection Act) - Canada
- **COPPA** (Children's Online Privacy Protection Act) - USA

## Support

For API support or questions:
- GitHub Issues: https://github.com/privacypriority/privacyhub/issues
- Website: https://privacyhub.in/support

## Changelog

### v1.0.0 (2025-10-16)
- Initial release of API v1
- POST /analyzer endpoint
- Comprehensive privacy analysis with 6-category scoring
- Support for GDPR, CCPA, and DPDP Act compliance checks
- 3-tier scraping fallback (Firecrawl → Crawlee → Fetch)
