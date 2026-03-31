'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Retry 3 times for auth or network errors
        if (failureCount < 3 && (error?.status === 401 || !error?.status)) {
          return true;
        }
        return false;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
