import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Say It With Love | Free Proposal Platform',
  description: 'Create beautiful, shareable proposals for your special someone. Free forever.',
  keywords: ['proposal', 'valentine', 'marriage', 'girlfriend', 'boyfriend', 'love', 'romantic'],
  authors: [{ name: 'Say It With Love' }],
  openGraph: {
    title: 'Say It With Love',
    description: 'Create beautiful, shareable proposals for your special someone.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f43f5e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 antialiased">
        {children}
      </body>
    </html>
  );
}
