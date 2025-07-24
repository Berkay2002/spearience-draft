import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ContentProvider } from '../components/content-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/ui/navigation';
import { Toaster } from '@/components/ui/toaster';
import { SEO_CONFIG } from '@/lib/seo';
import { SkipLinks } from '@/components/accessibility/skip-links';
import { AccessibilityProvider } from '@/components/accessibility/accessibility-provider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap', // Optimize font loading performance
  preload: true,
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  // Optimize for mobile-first responsive design
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.siteUrl),
  title: {
    default: "Chrish Fernando - Project Management Expert, Mentor & Sports Leadership Consultant",
    template: `%s | ${SEO_CONFIG.siteName}`
  },
  description: "Transforming teams and projects through proven leadership methodologies, strategic mentorship, and innovative sports-inspired approaches to professional development.",
  keywords: "project management, leadership, mentorship, sports consulting, Stockholm, business consulting",
  authors: [{ name: SEO_CONFIG.author.name, url: SEO_CONFIG.author.linkedin }],
  creator: SEO_CONFIG.author.name,
  publisher: SEO_CONFIG.siteName,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'theme-color': '#667eea',
    'color-scheme': 'light dark',
    'format-detection': 'telephone=no',
    // Mobile optimization
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Chrish Fernando',
    // Performance hints
    'dns-prefetch': 'https://fonts.googleapis.com',
    'preconnect': 'https://fonts.gstatic.com',
    // Search engine verification (configure in environment variables)
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    }),
    ...(process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION && {
      'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION,
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts for performance */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          as="style" 
        />
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap" 
          as="style" 
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccessibilityProvider>
            <ContentProvider>
              <SkipLinks />
              <Navigation />
              <main 
                id="main-content" 
                role="main" 
                className="min-h-screen pt-16 sm:pt-20"
                tabIndex={-1}
              >
                {children}
              </main>
              <Toaster />
            </ContentProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}