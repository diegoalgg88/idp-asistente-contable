'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground py-2 px-6">
      <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center">
        <Home className="h-4 w-4" />
      </Link>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

        return (
          <React.Fragment key={path}>
            <ChevronRight className="h-4 w-4 opacity-50" />
            {isLast ? (
              <span className="font-medium text-foreground">{title}</span>
            ) : (
              <Link to={href} className="hover:text-primary transition-colors">
                {title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
