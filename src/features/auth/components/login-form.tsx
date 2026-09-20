import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { isDemo } from "@/config/app"
import { RequestError } from "@/shared/components/request-error"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { login } from "../api/auth.services"
import { loginSchema } from "../types/auth.schemas"

export function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.cancelQueries()
      queryClient.clear()
      await router.invalidate()
      await router.navigate({ to: "/", replace: true })
    },
  })
  const form = useForm({
    defaultValues: {
      email: isDemo ? "demo@example.com" : "",
      password: isDemo ? "demo12345" : "",
    },
    validators: { onSubmit: loginSchema },
    onSubmit: ({ value }) => mutation.mutateAsync(value).catch(() => {}),
  })
  return (
    <form
      className="flex flex-col gap-5"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      {mutation.error && <RequestError error={mutation.error} />}
      <form.Field name="email">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby="email-error"
            />
            <p id="email-error" className="text-destructive text-sm">
              {field.state.meta.errors.map((error) => error?.message).join(" ")}
            </p>
          </div>
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby="password-error"
            />
            <p id="password-error" className="text-destructive text-sm">
              {field.state.meta.errors.map((error) => error?.message).join(" ")}
            </p>
          </div>
        )}
      </form.Field>
      <Button type="submit" size="lg" disabled={mutation.isPending}>
        {mutation.isPending ? "Entrando…" : "Entrar"}
      </Button>
      {isDemo && (
        <p className="text-center text-muted-foreground text-xs">
          Ambiente de demonstração. Os dados ficam neste navegador.
        </p>
      )}
    </form>
  )
}
