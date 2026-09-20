import { Link } from "@tanstack/react-router"
import {
  AppTable,
  AppTableSortableHeader,
  type AppTableUrlChange,
  bindAppTableToUrl,
  createAppColumnHelper,
  useAppTable,
} from "@/shared/components/app-table"
import { Badge } from "@/shared/components/ui/badge"
import { formatDate } from "@/shared/lib/format"
import type { Item, ItemsFilters } from "../types/items.schemas"

const column = createAppColumnHelper<Item>()
const columns = column.columns([
  column.accessor("name", {
    header: ({ header }) => (
      <AppTableSortableHeader header={header} label="Nome" />
    ),
    enableHiding: false,
    cell: ({ row }) => (
      <Link
        className="font-medium underline-offset-4 hover:underline"
        to="/items/$itemId/edit"
        params={{ itemId: row.original.id }}
      >
        {row.original.name}
      </Link>
    ),
  }),
  column.accessor("status", {
    header: "Situação",
    enableSorting: false,
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "secondary" : "outline"}
      >
        {row.original.status === "active" ? "Ativo" : "Arquivado"}
      </Badge>
    ),
  }),
  column.accessor("createdAt", {
    header: ({ header }) => (
      <AppTableSortableHeader header={header} label="Criado em" />
    ),
    cell: ({ row }) => formatDate(row.original.createdAt),
  }),
])

export function ItemsTable({
  items,
  total,
  filters,
  onChange,
}: {
  items: Item[]
  total: number
  filters: ItemsFilters
  onChange: AppTableUrlChange<"name" | "createdAt">
}) {
  const binding = bindAppTableToUrl(filters, onChange)
  const table = useAppTable({
    data: items,
    columns,
    rowCount: total,
    getRowId: (item) => item.id,
    ...binding.tableOptions,
  })
  return (
    <AppTable
      table={table}
      columnLabels={{
        name: "Nome",
        status: "Situação",
        createdAt: "Criado em",
      }}
      emptyMessage="Nenhum item encontrado."
      pagination={{ itemName: "itens" }}
      search={{ ...binding.search, label: "Buscar itens" }}
    />
  )
}
