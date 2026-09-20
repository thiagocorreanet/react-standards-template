import {
  columnVisibilityFeature,
  createTableHook,
  FlexRender,
  functionalUpdate,
  type Header,
  type PaginationState,
  type ReactTable,
  type RowData,
  rowPaginationFeature,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
  type Updater,
} from "@tanstack/react-table"
import { cn } from "cn"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Columns3Icon,
  SearchIcon,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/components/ui/input-group"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Skeleton } from "@/shared/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { useDebouncedCallback } from "@/shared/hooks/use-debounced-callback"
import { formatNumber } from "@/shared/lib/format"

export const { useAppTable, createAppColumnHelper, appFeatures } =
  createTableHook({
    features: tableFeatures({
      columnVisibilityFeature,
      rowPaginationFeature,
      rowSortingFeature,
    }),
    manualSorting: true,
    manualPagination: true,
  })

export type AppTableInstance<TData extends RowData> = ReactTable<
  typeof appFeatures,
  TData
>

export type AppTableUrlParams<TSortField extends string> = {
  q: string
  pagina: number
  porPagina: number
  ordenarPor?: TSortField
  ordem?: "asc" | "desc"
}

export type AppTableUrlChange<TSortField extends string> = (
  changes: Partial<AppTableUrlParams<TSortField>>,
  options: { replace: boolean }
) => void

export function bindAppTableToUrl<TSortField extends string>(
  params: AppTableUrlParams<TSortField>,
  onChange: AppTableUrlChange<TSortField>
) {
  const sorting: SortingState = params.ordenarPor
    ? [{ id: params.ordenarPor, desc: params.ordem === "desc" }]
    : []
  const pagination: PaginationState = {
    pageIndex: params.pagina - 1,
    pageSize: params.porPagina,
  }

  return {
    tableOptions: {
      state: { sorting, pagination },
      onSortingChange: (updater: Updater<SortingState>) => {
        const [next] = functionalUpdate(updater, sorting)
        onChange(
          {
            ordenarPor: next?.id as TSortField | undefined,
            ordem: next ? (next.desc ? "desc" : "asc") : undefined,
            pagina: 1,
          },
          { replace: false }
        )
      },
      onPaginationChange: (updater: Updater<PaginationState>) => {
        const next = functionalUpdate(updater, pagination)
        onChange(
          { pagina: next.pageIndex + 1, porPagina: next.pageSize },
          { replace: false }
        )
      },
    },
    search: {
      value: params.q,
      onChange: (term: string) =>
        onChange({ q: term, pagina: 1 }, { replace: true }),
    },
  }
}

type AppTableHeader<TData extends RowData, TValue> = Header<
  typeof appFeatures,
  TData,
  TValue
>

const PAGE_SIZES = [10, 20, 30, 40, 50]

const tableEdgePaddingClassName =
  "**:data-[slot=table-cell]:first:pl-4 **:data-[slot=table-cell]:last:pr-4 **:data-[slot=table-head]:first:pl-4 **:data-[slot=table-head]:last:pr-4"

export function AppTableSortableHeader<TData extends RowData, TValue>({
  header,
  label,
  align = "left",
}: {
  header: AppTableHeader<TData, TValue>
  label: string
  align?: "left" | "right"
}) {
  const direction = header.column.getIsSorted()
  const Icon =
    direction === "asc"
      ? ArrowUpIcon
      : direction === "desc"
        ? ArrowDownIcon
        : ArrowUpDownIcon

  return (
    <div className={align === "right" ? "flex" : undefined}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-muted-foreground text-xs hover:text-foreground",
          align === "right" ? "-mr-2 ml-auto" : "-ml-2"
        )}
        onClick={() => header.column.toggleSorting()}
      >
        {label}
        <Icon className="text-muted-foreground" />
      </Button>
    </div>
  )
}

const SEARCH_DELAY_MS = 300

type SearchOptions = {
  label: string
  onChange: (term: string) => void
  value?: string
}

function useAppTableSearch({
  value = "",
  onChange,
}: Pick<SearchOptions, "value" | "onChange">) {
  const [term, setTerm] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)
  const [lastSentTerm, setLastSentTerm] = useState<string>()

  if (value !== syncedValue) {
    setSyncedValue(value)
    if (value !== lastSentTerm) {
      setTerm(value)
      setLastSentTerm(undefined)
    }
  }

  const debouncedChange = useDebouncedCallback((next: string) => {
    setLastSentTerm(next)
    onChange(next)
  }, SEARCH_DELAY_MS)

  function changeTerm(next: string) {
    setTerm(next)
    debouncedChange(next)
  }

  return { term, changeTerm }
}

function AppTableSearch({ label, onChange, value }: SearchOptions) {
  const { term, changeTerm } = useAppTableSearch({ value, onChange })

  return (
    <>
      <Label htmlFor="app-table-search" className="sr-only">
        {label}
      </Label>
      <Input
        id="app-table-search"
        type="search"
        aria-label={label}
        placeholder={`${label}...`}
        value={term}
        className="max-w-sm bg-card"
        onChange={(event) => changeTerm(event.target.value)}
      />
    </>
  )
}

function AppTableColumnToggle<TData extends RowData>({
  table,
  columnLabels,
}: {
  table: AppTableInstance<TData>
  columnLabels: Record<string, string>
}) {
  const hideable = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )

  if (hideable.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <Columns3Icon />
        <span className="hidden lg:inline">Colunas</span>
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {hideable.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {columnLabels[column.id] ?? column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppTablePagination<TData extends RowData>({
  table,
  itemName,
}: {
  table: AppTableInstance<TData>
  itemName: string
}) {
  const total = table.getRowCount()
  const pageCount = Math.max(table.getPageCount(), 1)
  const currentPage = table.state.pagination.pageIndex + 1

  return (
    <div className="flex items-center justify-between">
      <div className="hidden flex-1 text-muted-foreground text-sm lg:flex">
        Total de {itemName}: {formatNumber(total)}
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="app-table-page-size" className="font-medium text-sm">
            Linhas por página
          </Label>
          <Select
            value={`${table.state.pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
            items={PAGE_SIZES.map((size) => ({
              label: `${size}`,
              value: `${size}`,
            }))}
          >
            <SelectTrigger size="sm" className="w-20" id="app-table-page-size">
              <SelectValue placeholder={table.state.pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center font-medium text-sm">
          Página {currentPage} de {pageCount}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para a primeira página</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Ir para a página anterior</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir para a próxima página</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Ir para a última página</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

function AppTablePanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="table-panel"
      className="flex flex-col gap-4 rounded-xl bg-card p-6 text-card-foreground ring-1 ring-foreground/10 lg:p-8"
    >
      {children}
    </div>
  )
}

function skeletonIds(prefix: string, count: number) {
  return Array.from({ length: count }, (_, index) => `${prefix}-${index}`)
}

export function AppTableSkeleton({
  rows,
  columns,
}: {
  rows: number
  columns: number
}) {
  const columnIds = skeletonIds("coluna", columns)

  return (
    <div className="px-4 lg:px-6" aria-busy="true">
      <span className="sr-only">Carregando…</span>
      <AppTablePanel>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-9.5 w-full max-w-sm" />
          <Skeleton className="h-7 w-24" />
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table className={tableEdgePaddingClassName}>
            <TableHeader className="bg-muted">
              <TableRow>
                {columnIds.map((id) => (
                  <TableHead key={id}>
                    <Skeleton className="h-4 w-20 bg-foreground/10" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonIds("linha", rows).map((rowId) => (
                <TableRow key={rowId} className="h-15">
                  {columnIds.map((columnId) => (
                    <TableCell key={columnId}>
                      <Skeleton className="h-5 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="hidden h-5 w-48 lg:block" />
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Skeleton className="mr-6 h-5 w-24" />
            {skeletonIds("pagina", 4).map((id) => (
              <Skeleton key={id} className="size-8" />
            ))}
          </div>
        </div>
      </AppTablePanel>
    </div>
  )
}

export function AppTable<TData extends RowData>({
  table,
  columnLabels,
  emptyMessage,
  search,
  pagination,
  embedded = false,
}: {
  table: AppTableInstance<TData>
  columnLabels: Record<string, string>
  emptyMessage: string
  search?: SearchOptions
  pagination?: { itemName?: string }
  /** Tabela dentro de uma seção: sem a caixa própria nem a barra de colunas. */
  embedded?: boolean
}) {
  const rows = table.getRowModel().rows
  const columnCount = table.getAllLeafColumns().length

  const content = (
    <>
      {!embedded && (
        <div className="flex items-center justify-between gap-2">
          {search ? <AppTableSearch {...search} /> : <div />}
          <AppTableColumnToggle table={table} columnLabels={columnLabels} />
        </div>
      )}

      <div className="overflow-hidden rounded-lg border">
        <Table className={tableEdgePaddingClassName}>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-muted-foreground text-xs"
                  >
                    {header.isPlaceholder ? null : (
                      <FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <AppTablePagination
          table={table}
          itemName={pagination.itemName ?? "linhas"}
        />
      )}
    </>
  )

  if (embedded) return <div className="flex flex-col gap-4">{content}</div>

  return (
    <div className="px-4 lg:px-6">
      <AppTablePanel>{content}</AppTablePanel>
    </div>
  )
}

const cardTableClassName =
  "**:data-[slot=table-cell]:first:pl-5 **:data-[slot=table-cell]:last:pr-5 **:data-[slot=table-head]:first:pl-5 **:data-[slot=table-head]:last:pr-5"

const cardTableHeadClassName =
  "h-10 font-medium text-muted-foreground text-xs uppercase tracking-wider"

function AppTableCardFrame({
  title,
  action,
  busy = false,
  children,
}: {
  title: string
  action?: React.ReactNode
  busy?: boolean
  children: React.ReactNode
}) {
  return (
    <Card className="gap-0 py-0" aria-busy={busy || undefined}>
      {busy && <span className="sr-only">Carregando…</span>}
      <CardHeader className="items-center border-b px-5 py-4">
        <CardTitle className="font-semibold">{title}</CardTitle>
        {action && (
          <CardAction className="row-span-1 self-center">{action}</CardAction>
        )}
      </CardHeader>
      {children}
    </Card>
  )
}

function AppTableCardSearch({ label, onChange, value }: SearchOptions) {
  const { term, changeTerm } = useAppTableSearch({ value, onChange })

  return (
    <InputGroup className="sm:max-w-sm">
      <InputGroupInput
        type="search"
        aria-label={label}
        placeholder={label}
        value={term}
        onChange={(event) => changeTerm(event.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  )
}

function AppTableCardToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  )
}

export function AppTableCard<TData extends RowData>({
  table,
  title,
  action,
  search,
  toolbarEnd,
  emptyMessage,
  pagination,
  footer,
  alignTop = false,
}: {
  table: AppTableInstance<TData>
  title: string
  action?: React.ReactNode
  search?: SearchOptions
  toolbarEnd?: React.ReactNode
  emptyMessage: string
  pagination?: { itemName: string }
  footer?: React.ReactNode
  alignTop?: boolean
}) {
  const rows = table.getRowModel().rows

  return (
    <AppTableCardFrame title={title} action={action}>
      {(search || toolbarEnd) && (
        <AppTableCardToolbar>
          {search ? <AppTableCardSearch {...search} /> : <div />}
          {toolbarEnd && (
            <div className="flex flex-wrap items-center gap-2">
              {toolbarEnd}
            </div>
          )}
        </AppTableCardToolbar>
      )}

      <Table className={cardTableClassName}>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={cardTableHeadClassName}
                >
                  {header.isPlaceholder ? null : <FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn("py-4", alignTop && "align-top")}
                  >
                    <FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllLeafColumns().length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && (
        <div className="border-t px-5 py-4">
          <AppTablePagination table={table} itemName={pagination.itemName} />
        </div>
      )}
      {footer && (
        <CardFooter className="justify-between gap-4 px-5 py-4 text-muted-foreground text-xs">
          {footer}
        </CardFooter>
      )}
    </AppTableCardFrame>
  )
}

export function AppTableCardSkeleton({
  title,
  columns,
  rows,
  action = false,
  toolbar = false,
  footer,
}: {
  title: string
  columns: readonly string[] | number
  rows: number
  action?: boolean
  toolbar?: boolean
  footer?: "pagination" | "summary"
}) {
  const headers =
    typeof columns === "number" ? skeletonIds("coluna", columns) : columns

  return (
    <AppTableCardFrame
      busy
      title={title}
      action={action && <Skeleton className="h-9.5 w-36" />}
    >
      {toolbar && (
        <AppTableCardToolbar>
          <Skeleton className="h-9.5 w-full sm:max-w-sm" />
          <Skeleton className="h-9.5 w-44" />
        </AppTableCardToolbar>
      )}

      <Table className={cardTableClassName}>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            {headers.map((header) => (
              <TableHead key={header} className={cardTableHeadClassName}>
                {typeof columns === "number" ? (
                  <Skeleton className="h-3 w-16" />
                ) : (
                  header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonIds("linha", rows).map((rowId) => (
            <TableRow key={rowId}>
              {headers.map((header) => (
                <TableCell key={header} className="py-4">
                  <Skeleton className="h-5 w-full max-w-32" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {footer === "pagination" && (
        <div className="flex items-center justify-between border-t px-5 py-4">
          <Skeleton className="hidden h-5 w-48 lg:block" />
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Skeleton className="mr-6 h-5 w-24" />
            {skeletonIds("pagina", 4).map((id) => (
              <Skeleton key={id} className="size-8" />
            ))}
          </div>
        </div>
      )}
      {footer === "summary" && (
        <CardFooter className="justify-between gap-4 px-5 py-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
        </CardFooter>
      )}
    </AppTableCardFrame>
  )
}
