import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../QueryClient';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';

export default function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools position="bottom-right" />}
    </QueryClientProvider>
  );
}
