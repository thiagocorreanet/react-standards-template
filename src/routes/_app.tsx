import { createFileRoute, redirect } from "@tanstack/react-router"
import { LogoutButton, sessionQueryOptions } from "@/features/auth"
import { AppShell } from "@/shared/components/app-shell"

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(sessionQueryOptions())
    if (!user) throw redirect({ to: "/login", replace: true })
    return { user }
  },
  component: AppLayout,
})

function AppLayout() {
  const { user } = Route.useRouteContext()
  return (
    <AppShell
      userName={user.name}
      userEmail={user.email}
      logout={<LogoutButton />}
    />
  )
}
