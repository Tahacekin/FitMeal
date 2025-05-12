'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Utensils, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuthButton from './AuthButton';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Utensils className="h-6 w-6 text-green-600" />
            <span className="font-bold">FitMeal</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-end space-x-1">
          <Link
            href="/favorites"
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              pathname === "/favorites" && "bg-accent"
            )}
          >
            <Heart className="mr-2 h-4 w-4" />
            Favorites
          </Link>
          <Link
            href="/account"
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              pathname === "/account" && "bg-accent"
            )}
          >
            <User className="mr-2 h-4 w-4" />
            Account
          </Link>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}