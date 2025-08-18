import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 min
      gcTime: 60 * 60 * 1000, // 1 h
      retry: 1,
      refetchOnWindowFocus: false,
      networkMode: 'online',
    },
  },
});
