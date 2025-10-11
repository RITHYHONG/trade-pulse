"use client";

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface CustomBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function CustomBreadcrumb({ items, className = "" }: CustomBreadcrumbProps) {
  const pathname = usePathname();
  
  // Generate breadcrumbs automatically based on pathname if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      
      // Create user-friendly labels
      let label = path.charAt(0).toUpperCase() + path.slice(1);
      if (path === 'blog') label = 'Blog';
      if (path === 'create-post') label = 'Create Post';
      if (path === 'about') label = 'About';
      if (path === 'contact') label = 'Contact';
      if (path === 'pricing') label = 'Pricing';
      if (path === 'features') label = 'Features';
      
      breadcrumbs.push({
        label: decodeURIComponent(label),
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs for home page only
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-400 ${className}`}
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index === 0 && (
            <Home className="w-4 h-4 mr-1" />
          )}
          
          {index < breadcrumbItems.length - 1 ? (
            <Link 
              href={item.href}
              className="hover:text-primary transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">
              {item.label}
            </span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="w-4 h-4 mx-2 text-gray-500" />
          )}
        </div>
      ))}
    </nav>
  );
}