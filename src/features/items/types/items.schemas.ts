import { z } from "zod"

export const itemStatusSchema = z.enum(["active", "archived"])
export const itemInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe pelo menos 2 caracteres.")
    .max(100, "Use até 100 caracteres."),
  description: z.string().trim().max(500, "Use até 500 caracteres."),
  status: itemStatusSchema,
})
export const itemSchema = itemInputSchema.extend({
  id: z.string(),
  createdAt: z.iso.datetime(),
})
export const itemListSchema = z.object({
  items: z.array(itemSchema),
  total: z.number().int().nonnegative(),
})
export const itemsFiltersSchema = z.object({
  q: z.string().max(200).default("").catch(""),
  pagina: z.number().int().min(1).default(1).catch(1),
  porPagina: z.number().int().min(5).max(100).default(10).catch(10),
  ordenarPor: z.enum(["name", "createdAt"]).optional().catch(undefined),
  ordem: z.enum(["asc", "desc"]).optional().catch(undefined),
})
export type Item = z.infer<typeof itemSchema>
export type ItemInput = z.infer<typeof itemInputSchema>
export type ItemsFilters = z.infer<typeof itemsFiltersSchema>
