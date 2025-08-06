'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache settings
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,

      //background refetching
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,

      // Error handling
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Error handling
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
