import type { LinkProps } from "@tanstack/react-router"
import { LayoutDashboardIcon, ListChecksIcon } from "lucide-react"

export const navigation = [
  { title: "Visão geral", to: "/", icon: LayoutDashboardIcon },
  { title: "Itens", to: "/items", icon: ListChecksIcon },
] satisfies {
  title: string
  to: LinkProps["to"]
  icon: typeof ListChecksIcon
}[]
