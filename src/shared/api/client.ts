import ky, { HTTPError } from "ky"
import { z } from "zod"

const configuredUrl = import.meta.env.VITE_API_URL || "/api/"
export const apiBaseUrl = new URL(
  configuredUrl.endsWith("/") ? configuredUrl : `${configuredUrl}/`,
  window.location.origin
).href
export const sessionExpiredEvent = "app:session-expired"
let csrfToken: string | null = null

export function setCsrfToken(value: string | null) {
  csrfToken = value
}

export const api = ky.create({
  baseUrl: apiBaseUrl,
  credentials: "include",
  timeout: 15_000,
  retry: 0,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        if (csrfToken && !["GET", "HEAD", "OPTIONS"].includes(request.method)) {
          request.headers.set("X-CSRF-Token", csrfToken)
        }
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        if (
          response.status === 401 &&
          new URL(request.url).pathname !==
            new URL("session", apiBaseUrl).pathname
        ) {
          window.dispatchEvent(new Event(sessionExpiredEvent))
        }
      },
    ],
  },
})

export async function requestJson<T>(
  schema: z.ZodType<T>,
  url: string,
  options?: Parameters<typeof api>[1]
): Promise<T> {
  return schema.parse(await api(url, options).json())
}

export function isHttpError(error: unknown, status: number) {
  return error instanceof HTTPError && error.response.status === status
}

export function isRetryableError(error: unknown) {
  if (error instanceof z.ZodError) return false
  return !(error instanceof HTTPError) || error.response.status >= 500
}

export function errorMessage(error: unknown): string {
  if (error instanceof HTTPError) {
    const result = z.object({ message: z.string() }).safeParse(error.data)
    if (result.success) return result.data.message
    if (error.response.status === 401)
      return "Sua sessão expirou. Entre novamente."
    if (error.response.status === 403) return "Você não tem acesso a esta ação."
    return "Não foi possível concluir a solicitação. Tente novamente."
  }
  if (error instanceof z.ZodError)
    return "O servidor retornou dados em um formato inesperado."
  return "Não foi possível conectar ao servidor. Verifique sua conexão."
}
