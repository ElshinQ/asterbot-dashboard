import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from './providers';
import { DatabaseProvider } from '@/contexts/DatabaseContext';

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
});

export const metadata: Metadata = {
  title: 'ICHIGO Crypto Bot Dashboard',
  description: 'Real-time statistics for ICHIGO Crypto Bot trading system',
  icons: {
    icon: [
      { url: '/ichigo-logo.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/ichigo-logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexMono.variable} antialiased bg-white text-gray-900`}
      >
        <QueryProvider>
          <DatabaseProvider>
            {children}
          </DatabaseProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
