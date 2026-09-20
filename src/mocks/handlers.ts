import { delay, HttpResponse, http } from "msw"
import { z } from "zod"
import { appConfig } from "@/config/app"
import { type Item, itemInputSchema, itemSchema } from "@/features/items"
import { apiBaseUrl } from "@/shared/api/client"

const storageKey = `${appConfig.storageKey}.demo`
const csrf = "demo-csrf-token"
const user = {
  id: "demo",
  name: "Alex Silva",
  email: "demo@example.com",
  permissions: ["items.read", "items.write"],
}
const titles = [
  "Biblioteca de componentes",
  "Documentação do produto",
  "Guia de boas-vindas",
  "Pesquisa com usuários",
  "Plano de comunicação",
  "Revisão de conteúdo",
]
const storeSchema = z.object({
  signedIn: z.boolean(),
  items: z.array(itemSchema),
})

function seed() {
  return {
    signedIn: false,
    items: Array.from(
      { length: 18 },
      (_, index): Item => ({
        id: String(index + 1),
        name: `${titles[index % titles.length]}${index >= titles.length ? ` ${Math.floor(index / titles.length) + 1}` : ""}`,
        description: "Registro de exemplo para organizar o trabalho da equipe.",
        status: index % 5 === 0 ? "archived" : "active",
        createdAt: "2026-01-15T12:00:00.000Z",
      })
    ),
  }
}

function readStore() {
  try {
    const parsed = storeSchema.safeParse(
      JSON.parse(localStorage.getItem(storageKey) ?? "null")
    )
    if (parsed.success) return parsed.data
  } catch {
    /* Tests and restricted browsers use memory only. */
  }
  return seed()
}
let store = readStore()
function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(store))
  } catch {
    /* Memory is enough for the demo. */
  }
}
export function resetMockState() {
  store = seed()
  persist()
}
const url = (path: string) => new URL(path, apiBaseUrl).href
const message = (value: string, status: number) =>
  HttpResponse.json({ message: value }, { status })

function authorize(request: Request) {
  if (!store.signedIn)
    return message("Sua sessão expirou. Entre novamente.", 401)
  if (request.method !== "GET" && request.headers.get("X-CSRF-Token") !== csrf)
    return message("Atualize a página e tente novamente.", 403)
}

export const handlers = [
  http.get(url("session"), () =>
    HttpResponse.json({ user: store.signedIn ? user : null, csrfToken: csrf })
  ),
  http.post(url("session"), async ({ request }) => {
    if (request.headers.get("X-CSRF-Token") !== csrf)
      return message("Atualize a página e tente novamente.", 403)
    const input = z
      .object({ email: z.string(), password: z.string() })
      .safeParse(await request.json())
    if (
      !input.success ||
      input.data.email !== "demo@example.com" ||
      input.data.password !== "demo12345"
    )
      return message("E-mail ou senha inválidos.", 401)
    store.signedIn = true
    persist()
    return HttpResponse.json({ user, csrfToken: csrf })
  }),
  http.delete(url("session"), ({ request }) => {
    if (request.headers.get("X-CSRF-Token") !== csrf)
      return message("Atualize a página e tente novamente.", 403)
    store.signedIn = false
    persist()
    return new HttpResponse(null, { status: 204 })
  }),
  http.get(url("items"), async ({ request }) => {
    const denied = authorize(request)
    if (denied) return denied
    await delay(100)
    const query = new URL(request.url).searchParams
    const input = z
      .object({
        q: z.string().max(200).default(""),
        page: z.coerce.number().int().min(1).default(1),
        pageSize: z.coerce.number().int().min(1).max(100).default(10),
        sort: z.enum(["name", "createdAt"]).default("name"),
        order: z.enum(["asc", "desc"]).default("asc"),
      })
      .safeParse(Object.fromEntries(query))
    if (!input.success) return message("Filtros inválidos.", 422)
    const { q, page, pageSize, sort, order } = input.data
    const filtered = store.items
      .filter((item) =>
        item.name.toLocaleLowerCase().includes(q.toLocaleLowerCase())
      )
      .sort(
        (a, b) => a[sort].localeCompare(b[sort]) * (order === "asc" ? 1 : -1)
      )
    return HttpResponse.json({
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
    })
  }),
  http.get(url("items/:id"), ({ request, params }) => {
    const denied = authorize(request)
    if (denied) return denied
    const item = store.items.find((item) => item.id === params.id)
    return item ? HttpResponse.json(item) : message("Item não encontrado.", 404)
  }),
  http.post(url("items"), async ({ request }) => {
    const denied = authorize(request)
    if (denied) return denied
    const input = itemInputSchema.safeParse(await request.json())
    if (!input.success) return message("Revise os campos do item.", 422)
    const item = {
      ...input.data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    store.items.push(item)
    persist()
    return HttpResponse.json(item, { status: 201 })
  }),
  http.put(url("items/:id"), async ({ request, params }) => {
    const denied = authorize(request)
    if (denied) return denied
    const existing = store.items.find((item) => item.id === params.id)
    if (!existing) return message("Item não encontrado.", 404)
    const input = itemInputSchema.safeParse(await request.json())
    if (!input.success) return message("Revise os campos do item.", 422)
    Object.assign(existing, input.data)
    persist()
    return HttpResponse.json(existing)
  }),
  http.delete(url("items/:id"), ({ request, params }) => {
    const denied = authorize(request)
    if (denied) return denied
    if (!store.items.some((item) => item.id === params.id))
      return message("Item não encontrado.", 404)
    store.items = store.items.filter((item) => item.id !== params.id)
    persist()
    return new HttpResponse(null, { status: 204 })
  }),
]
