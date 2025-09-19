'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          // Prevent automatic background refetching
          refetchOnWindowFocus: false,
          // Retry failed requests
          retry: 2,
          // Stale time - how long data is considered fresh
          staleTime: 5 * 60 * 1000, // 5 minutes
          // Cache time - how long unused data stays in cache
          gcTime: 10 * 60 * 1000, // 10 minutes
        },
        mutations: {
          // Retry failed mutations
          retry: 1,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
}