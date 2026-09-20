import type { UnhandledRequestCallback } from "msw"
import { setupWorker } from "msw/browser"
import { apiBaseUrl } from "@/shared/api/client"
import { handlers } from "./handlers"

export const worker = setupWorker(...handlers)
export const onUnhandledRequest: UnhandledRequestCallback = (
  request,
  print
) => {
  if (request.url.startsWith(apiBaseUrl)) print.error()
}
