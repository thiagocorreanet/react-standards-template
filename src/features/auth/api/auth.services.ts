import { api, requestJson, setCsrfToken } from "@/shared/api/client"
import { type LoginInput, sessionSchema } from "../types/auth.schemas"

export async function fetchSession(signal?: AbortSignal) {
  const session = await requestJson(sessionSchema, "session", { signal })
  setCsrfToken(session.csrfToken)
  return session.user
}

export async function login(input: LoginInput) {
  const session = await requestJson(sessionSchema, "session", {
    method: "post",
    json: input,
  })
  if (!session.user) throw new Error("Login did not establish a session")
  setCsrfToken(session.csrfToken)
  return session.user
}

export async function logout() {
  await api.delete("session")
  setCsrfToken(null)
}
