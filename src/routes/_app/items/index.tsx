import { useQuery } from "@tanstack/react-query"
import {
  createFileRoute,
  Link,
  stripSearchParams,
} from "@tanstack/react-router"
import { PlusIcon } from "lucide-react"
import {
  ItemsTable,
  itemsFiltersSchema,
  itemsQueryOptions,
} from "@/features/items"
import { AppTableSkeleton } from "@/shared/components/app-table"
import { RequestError } from "@/shared/components/request-error"
import { buttonVariants } from "@/shared/components/ui/button"

export const Route = createFileRoute("/_app/items/")({
  validateSearch: itemsFiltersSchema,
  search: {
    middlewares: [stripSearchParams({ q: "", pagina: 1, porPagina: 10 })],
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    void context.queryClient.prefetchQuery(itemsQueryOptions(deps))
  },
  component: ItemsPage,
})

function ItemsPage() {
  const filters = Route.useSearch()
  const navigate = Route.useNavigate()
  const items = useQuery(itemsQueryOptions(filters))
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Itens</h1>
          <p className="mt-2 text-muted-foreground">
            Organize e mantenha seus registros atualizados.
          </p>
        </div>
        <Link to="/items/new" className={buttonVariants()}>
          <PlusIcon />
          Novo item
        </Link>
      </div>
      {items.isPending && <AppTableSkeleton columns={3} rows={5} />}
      {items.error && (
        <RequestError
          error={items.error}
          onRetry={() => void items.refetch()}
        />
      )}
      {items.data && (
        <div aria-busy={items.isFetching}>
          <ItemsTable
            items={items.data.items}
            total={items.data.total}
            filters={filters}
            onChange={(changes, options) => {
              void navigate({
                search: (previous) => ({ ...previous, ...changes }),
                replace: options.replace,
              })
            }}
          />
        </div>
      )}
    </div>
  )
}
