# PrivacyHub

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

PrivacyHub is an AI-powered privacy policy analyzer that helps users understand and evaluate website privacy practices. It provides detailed analysis, scoring, and recommendations for privacy policies.

![PrivacyHub Screenshot](https://raw.githubusercontent.com/privacypriority/privacyhub/main/public/screenshot.png)

## Features

- 🤖 AI-powered privacy policy analysis using Google's Gemini
- 📊 Comprehensive scoring across multiple privacy aspects
- 💾 Local-first architecture with IndexedDB storage
- 🔍 Automatic privacy policy detection
- 📱 Responsive design for all devices
- 🌙 Dark mode support
- 📄 PDF export functionality
- 📈 Historical analysis tracking

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- OpenRouter API key (get one from https://openrouter.ai/keys)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/privacypriority/privacyhub.git
cd privacyhub
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file and update it with your API key:
```bash
cp .env.example .env
```

4. Edit the `.env` file and add your OpenRouter API key:
```env
VITE_SITE_URL=localhost
VITE_SITE_NAME=PrivacyHub
VITE_OPENROUTER_API_KEY=your-openrouter-api-key
```

⚠️ **IMPORTANT**: Never commit your `.env` file or expose your API key!

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

[Rest of README.md content remains the same...]