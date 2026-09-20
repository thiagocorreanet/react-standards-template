import { keepPreviousData, queryOptions } from "@tanstack/react-query"
import type { ItemsFilters } from "../types/items.schemas"
import { fetchItem, fetchItems } from "./items.services"

export const itemsKeys = {
  all: ["items"] as const,
  lists: () => [...itemsKeys.all, "list"] as const,
  list: (filters: ItemsFilters) => [...itemsKeys.lists(), filters] as const,
  detail: (id: string) => [...itemsKeys.all, "detail", id] as const,
}
export const itemsQueryOptions = (filters: ItemsFilters) =>
  queryOptions({
    queryKey: itemsKeys.list(filters),
    queryFn: ({ signal }) => fetchItems(filters, signal),
    placeholderData: keepPreviousData,
  })
export const itemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: itemsKeys.detail(id),
    queryFn: ({ signal }) => fetchItem(id, signal),
  })
