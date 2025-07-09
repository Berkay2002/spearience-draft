import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ContentProvider } from '../components/content-provider';
import { Navigation } from '@/components/ui/navigation';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Chrish Fernando - Project Management Expert, Mentor & Sports Leadership Consultant",
  description: "Transforming teams and projects through proven leadership methodologies, strategic mentorship, and innovative sports-inspired approaches to professional development.",
  keywords: "project management, leadership, mentorship, sports consulting, Stockholm, business consulting",
  authors: [{ name: "Chrish Fernando" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ContentProvider>
          <Navigation />
          <main className="min-h-screen pt-20">
            {children}
          </main>
        </ContentProvider>
      </body>
    </html>
  );
}