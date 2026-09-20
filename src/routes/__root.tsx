import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
} from "@tanstack/react-router"
import { useEffect } from "react"
import { Toaster } from "sonner"
import { sessionExpiredEvent, setCsrfToken } from "@/shared/api/client"
import { useTheme } from "@/shared/components/theme-provider"
import { Button } from "@/shared/components/ui/button"

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Root,
    notFoundComponent: () => (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <Link className="mt-4 inline-block underline" to="/">
          Voltar ao início
        </Link>
      </div>
    ),
    errorComponent: ({ reset }) => (
      <div role="alert" className="space-y-4 p-10">
        <h1 className="text-2xl font-semibold">
          Não foi possível abrir esta página
        </h1>
        <p>Verifique sua conexão e tente novamente.</p>
        <Button onClick={reset}>Tentar novamente</Button>
      </div>
    ),
  }
)

function Root() {
  const router = useRouter()
  const { queryClient } = Route.useRouteContext()
  const { theme } = useTheme()
  useEffect(() => {
    const expire = () => {
      setCsrfToken(null)
      void queryClient.cancelQueries().then(async () => {
        queryClient.clear()
        await router.navigate({ to: "/login", replace: true })
        await router.invalidate()
      })
    }
    window.addEventListener(sessionExpiredEvent, expire)
    return () => window.removeEventListener(sessionExpiredEvent, expire)
  }, [queryClient, router])
  return (
    <>
      <Outlet />
      <Toaster theme={theme} richColors position="bottom-right" />
    </>
  )
}
