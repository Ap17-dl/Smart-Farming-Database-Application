'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/farmers', label: 'Farmers' },
    { href: '/crops', label: 'Crops' },
    { href: '/sales', label: 'Sales' },
    { href: '/sensor-data', label: 'Sensor Data' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-card border-b border-accent/20 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <Leaf className="w-5 h-5" />
            SmartFarm
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 text-primary hover:bg-secondary rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
