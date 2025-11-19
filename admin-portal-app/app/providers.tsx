// app/providers.tsx
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Define a simple client for performance optimization
const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 5, // Simple 5-second stale time for the mock data
      },
    },
  });

// DEFAULT export the Providers component
export default function Providers({ children }: { children: React.ReactNode }) {
  // We use useState to prevent the client from being created on every render
  const [queryClient] = useState(makeQueryClient);

  return (
    // This is the essential wrapper for all components using useQuery
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
