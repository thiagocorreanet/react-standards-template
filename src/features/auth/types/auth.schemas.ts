import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  permissions: z.array(z.string()),
})
export const sessionSchema = z.object({
  user: userSchema.nullable(),
  csrfToken: z.string().min(1),
})
export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
})
export type User = z.infer<typeof userSchema>
export type LoginInput = z.infer<typeof loginSchema>
