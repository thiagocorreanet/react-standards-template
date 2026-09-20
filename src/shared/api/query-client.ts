import { QueryClient } from "@tanstack/react-query"
import { isRetryableError } from "./client"

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (count, error) => count < 1 && isRetryableError(error),
      },
      mutations: { retry: false },
    },
  })
}
