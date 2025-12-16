import type { Metadata } from 'next';
import './globals.css';
import { Montserrat } from 'next/font/google';


export const metadata: Metadata = {
  title: 'Movie Management',
  description: 'Manage your movie collection',
};

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat'
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}

