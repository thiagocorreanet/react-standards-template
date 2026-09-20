import { queryOptions } from "@tanstack/react-query"
import { fetchSession } from "./auth.services"

export const sessionKey = ["session"] as const
export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: sessionKey,
    queryFn: ({ signal }) => fetchSession(signal),
    staleTime: 0,
    retry: false,
  })
