import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth/auth-context';

export const metadata: Metadata = {
  title: 'Digital Heroes | Subscription Golf, Charity & Monthly Draws',
  description:
    'Subscription-driven platform combining Stableford golf performance tracking, charity fundraising, and monthly draw-based prize pools.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 350px)' }}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
