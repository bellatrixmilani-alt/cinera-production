import './globals.css';
import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import FlowerDoodle from '@/components/ui/FlowerDoodle';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cinera AI — The Haven for Your Story',
  description: 'A workspace designed for calm, beauty and brilliance.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://cinera.vercel.app'
  ),
  openGraph: {
    title: 'Cinera AI — The Haven for Your Story',
    description: 'A workspace designed for calm, beauty and brilliance.',
    siteName: 'Cinera AI',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Cinera AI — The Haven for Your Story',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cinera AI — The Haven for Your Story',
    description: 'A workspace designed for calm, beauty and brilliance.',
    images: ['/opengraph-image'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#FAF6F0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${playfair.variable} ${jakarta.variable}`}>
      <body className="relative min-h-screen min-h-[100dvh] bg-[#FAF6F0] text-[#241711] antialiased selection:bg-[#EADBC8] overflow-x-hidden font-sans">
        {/* AUTOMATIC GLOBAL RETRO FLORAL BACKGROUND */}
        <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
          {/* Top Left */}
          <FlowerDoodle
            size={70}
            className="absolute -top-3 -left-3 -rotate-12 opacity-35"
            colorFill="#C5B4A1"
            colorLine="#8C4A27"
          />

          {/* Top Right */}
          <FlowerDoodle
            size={65}
            className="absolute top-12 -right-4 rotate-45 opacity-30"
            colorFill="#C5B4A1"
            colorLine="#8C4A27"
          />

          {/* Mid Left */}
          <FlowerDoodle
            size={55}
            className="absolute top-[48%] -left-4 rotate-12 opacity-25"
            colorFill="#C5B4A1"
            colorLine="#8C4A27"
          />

          {/* Bottom Right */}
          <FlowerDoodle
            size={75}
            className="absolute -bottom-4 -right-4 rotate-12 opacity-35"
            colorFill="#C5B4A1"
            colorLine="#8C4A27"
          />
        </div>

        {/* ALL PAGES RENDER HERE ON TOP OF THE FLOWERS */}
        <div className="relative z-10 min-h-screen min-h-[100dvh] flex flex-col">
          {children}
        </div>

        {/* LIGHTWEIGHT REAL-TIME ANALYTICS */}
        <Analytics />
      </body>
    </html>
  );
}