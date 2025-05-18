import { Geist_Sans, Geist_Mono } from 'next/font/google';

export const geistSans = Geist_Sans({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});
