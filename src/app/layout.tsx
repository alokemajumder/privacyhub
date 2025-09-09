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
  metadataBase: new URL('https://privacyhub.in'),
  title: "Know What Apps Do With Your Data | PrivacyHub.in",
  description: "Free privacy checker for everyday users. Understand how the apps and websites you use daily handle your personal data. Learn to protect your digital privacy with simple, actionable tips.",
  keywords: "privacy awareness, data privacy, personal data protection, app privacy, digital privacy, privacy education, GDPR rights, privacy policy checker, data security",
  authors: [{ name: "PrivacyHub.in" }],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Privacy Policy Analyzer | PrivacyHub.in",
    description: "Professional privacy policy analysis powered by AI",
    type: "website",
    url: "https://privacyhub.in",
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'PrivacyHub Logo',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy Analyzer | PrivacyHub.in",
    description: "Professional privacy policy analysis powered by AI",
    images: ['/android-chrome-512x512.png'],
  },
};

export function generateViewport() {
  return {
    themeColor: '#1e293b',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-white`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
