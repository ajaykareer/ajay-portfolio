import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ajay Kareer — Software & Hardware Engineer',
  description: 'Ajay Kareer is a Software & Hardware Engineer at CreativePOS. Explore web applications, practical tools, and the person behind the work.',
  icons: { icon: '/favicon.svg' },
  metadataBase: new URL('https://ajay-kareer-portfolio.goli15.chatgpt.site'),
  openGraph: {
    title: 'Ajay Kareer — Software & Hardware Engineer',
    description: 'Software meets the real world. Explore my projects, experience, and the person behind the work.',
    type: 'website',
    images: [{ url: '/og.png', width: 1672, height: 941, alt: 'Ajay Kareer — Software & Hardware Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ajay Kareer — Software & Hardware Engineer',
    description: 'Software meets the real world. Explore my projects and experience.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
