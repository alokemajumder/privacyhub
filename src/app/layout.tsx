import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Privacy Policy Analyzer | PrivacyHub.in",
  description: "Professional privacy policy analysis powered by AI. Understand how websites handle your personal data with comprehensive scoring, regulatory compliance checks, and actionable recommendations.",
  keywords: "privacy policy, GDPR, CCPA, privacy analysis, data protection, privacy compliance, AI analysis",
  authors: [{ name: "PrivacyHub.in" }],
  openGraph: {
    title: "Privacy Policy Analyzer | PrivacyHub.in",
    description: "Professional privacy policy analysis powered by AI",
    type: "website",
    url: "https://privacyhub.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy Analyzer | PrivacyHub.in",
    description: "Professional privacy policy analysis powered by AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-white`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
