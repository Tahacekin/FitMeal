import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/Navbar';
import Onboarding from '@/components/Onboarding';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FitMeal - AI-Powered Fitness Meal Planner',
  description: 'Plan your meals based on your fitness goals and budget',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Onboarding />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}