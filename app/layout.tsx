import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://passtrack.sg'),
  title: 'PassTrack — Early Access for Singapore HR Teams',
  description:
    'Track Employment Pass, S Pass and Work Permit expiries before they become compliance risks.',
  openGraph: {
    title: 'PassTrack — Early Access',
    description:
      'A smarter way for Singapore companies to track work pass expiries and reduce compliance stress.',
    url: 'https://passtrack.sg',
    siteName: 'PassTrack',
    locale: 'en_SG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-SG">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
