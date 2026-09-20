import { Link, Outlet, useLocation } from "@tanstack/react-router"
import {
  ArrowUpRightIcon,
  MenuIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react"
import { useState } from "react"
import { appConfig, isDemo } from "@/config/app"
import { navigation } from "@/config/navigation"
import { useTheme } from "./theme-provider"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

function Brand() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 font-semibold tracking-tight"
    >
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
      >
        <ArrowUpRightIcon className="size-5" />
      </span>
      {appConfig.name}
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Principal" className="flex flex-col gap-1">
      {navigation.map(({ title, to, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground"
          activeProps={{ className: "bg-accent font-medium text-foreground" }}
        >
          <Icon className="size-4" />
          {title}
        </Link>
      ))}
    </nav>
  )
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const next =
    theme === "system" ? "light" : theme === "light" ? "dark" : "system"
  const Icon =
    theme === "system" ? MonitorIcon : theme === "light" ? SunIcon : MoonIcon
  const labels = { light: "claro", dark: "escuro", system: "do sistema" }
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Tema ${labels[theme]}. Mudar para ${labels[next]}`}
      onClick={() => setTheme(next)}
    >
      <Icon />
    </Button>
  )
}

export function AppShell({
  userName,
  userEmail,
  logout,
}: {
  userName: string
  userEmail: string
  logout: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const current =
    navigation.find((item) => item.to === location.pathname) ??
    navigation.find(
      (item) => item.to !== "/" && location.pathname.startsWith(item.to)
    )
  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:p-3"
      >
        Pular para o conteúdo
      </a>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-sidebar p-6 md:flex">
        <Brand />
        <p className="mt-10 mb-3 px-3 font-medium text-muted-foreground text-xs uppercase tracking-widest">
          Workspace
        </p>
        <NavLinks />
        <div className="mt-auto border-t pt-5">
          <p className="truncate text-sm font-medium">{userName}</p>
          <p className="mt-1 truncate text-muted-foreground text-xs">
            {userEmail}
          </p>
        </div>
      </aside>
      <div className="md:pl-64">
        <header className="flex h-18 items-center justify-between gap-4 border-b bg-background px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Abrir navegação"
                  />
                }
              >
                <MenuIcon />
              </SheetTrigger>
              <SheetContent side="left" className="p-6">
                <SheetHeader className="p-0 pb-5">
                  <SheetTitle>{appConfig.name}</SheetTitle>
                </SheetHeader>
                <NavLinks onNavigate={() => setMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <p className="text-sm font-medium">
              {current?.title ?? appConfig.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isDemo && (
              <span className="rounded-full border px-2.5 py-1 text-muted-foreground text-xs">
                Demonstração
              </span>
            )}
            <ThemeSwitcher />
            {logout}
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto max-w-6xl p-5 outline-none sm:p-8 lg:p-10"
        >
          <Outlet />
        </main>
        <footer className="px-8 py-6 text-center text-muted-foreground text-xs">
          {appConfig.name} · {appConfig.description}
        </footer>
      </div>
    </div>
  )
}
