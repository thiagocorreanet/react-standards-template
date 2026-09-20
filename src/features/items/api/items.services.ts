import { api, requestJson } from "@/shared/api/client"
import {
  type ItemInput,
  type ItemsFilters,
  itemListSchema,
  itemSchema,
} from "../types/items.schemas"

export function fetchItems(filters: ItemsFilters, signal?: AbortSignal) {
  const query = new URLSearchParams({
    q: filters.q,
    page: String(filters.pagina),
    pageSize: String(filters.porPagina),
    sort: filters.ordenarPor ?? "name",
    order: filters.ordem ?? "asc",
  })
  return requestJson(itemListSchema, `items?${query}`, { signal })
}

export function fetchItem(id: string, signal?: AbortSignal) {
  return requestJson(itemSchema, `items/${encodeURIComponent(id)}`, { signal })
}

export function saveItem({ id, input }: { id?: string; input: ItemInput }) {
  return requestJson(
    itemSchema,
    id ? `items/${encodeURIComponent(id)}` : "items",
    { method: id ? "put" : "post", json: input }
  )
}

export async function deleteItem(id: string) {
  await api.delete(`items/${encodeURIComponent(id)}`)
}
