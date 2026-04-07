import '../portraitpro.css';
import { DM_Sans, Space_Grotesk } from 'next/font/google';

const dmSans = DM_Sans({
  variable: '--font-pp-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-pp-heading',
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${dmSans.variable} ${spaceGrotesk.variable} pp-page`} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
