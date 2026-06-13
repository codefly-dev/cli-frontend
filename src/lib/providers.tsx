"use client";

import { TransportProvider } from "@connectrpc/connect-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";
import { transport } from "./transport";

/**
 * App-wide providers: Connect transport + TanStack Query (via connect-query) +
 * theme. Self-contained so the whole dashboard can be mounted inside any React
 * host (e.g. a future codefly SaaS shell) by reusing this provider.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // The CLI is local + cheap to hit; keep data fresh but don't spam.
            staleTime: 2_000,
            refetchInterval: 5_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <TransportProvider transport={transport}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </TransportProvider>
  );
}
