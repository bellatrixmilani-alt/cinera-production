import './globals.css';
import React from 'react';
import FlowerDoodle from '@/components/landing/FlowerDoodle';

export const metadata = {
  title: 'Cinera AI — The Haven for Your Story',
  description: 'A workspace designed for calm, beauty and brilliance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-[#FAF6F0] text-[#241711] antialiased">
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
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}