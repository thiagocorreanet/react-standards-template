import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  AppTable,
  bindAppTableToUrl,
  createAppColumnHelper,
  useAppTable,
} from "@/shared/components/app-table"

type Row = { id: string; name: string }

const column = createAppColumnHelper<Row>()
const columns = column.columns([column.accessor("name", { header: "Nome" })])

function SearchableTable({
  value,
  onChange,
}: {
  value: string
  onChange: (term: string) => void
}) {
  const table = useAppTable({ data: [], columns })

  return (
    <AppTable
      table={table}
      columnLabels={{ name: "Nome" }}
      emptyMessage="Nada encontrado."
      search={{ label: "Buscar", value, onChange }}
    />
  )
}

function searchBox() {
  return screen.getByLabelText<HTMLInputElement>("Buscar")
}

describe("busca da AppTable", () => {
  it("limpa o texto quando o filtro do endereço some por fora", () => {
    const { rerender } = render(
      <SearchableTable value="maria" onChange={() => {}} />
    )
    expect(searchBox().value).toBe("maria")

    rerender(<SearchableTable value="" onChange={() => {}} />)

    expect(searchBox().value).toBe("")
  })

  it("não apaga o que a pessoa ainda digita quando o endereço confirma a busca anterior", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <SearchableTable value="" onChange={onChange} />
    )

    await user.type(searchBox(), "ma")
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("ma"))

    await user.type(searchBox(), "r")
    rerender(<SearchableTable value="ma" onChange={onChange} />)

    expect(searchBox().value).toBe("mar")
  })

  it("volta a acompanhar o endereço quando ele repete uma busca já feita", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <SearchableTable value="" onChange={onChange} />
    )

    await user.type(searchBox(), "ma")
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("ma"))
    rerender(<SearchableTable value="ma" onChange={onChange} />)
    rerender(<SearchableTable value="" onChange={onChange} />)
    rerender(<SearchableTable value="ma" onChange={onChange} />)

    expect(searchBox().value).toBe("ma")
  })
})

describe("bindAppTableToUrl", () => {
  const params = { q: "", pagina: 3, porPagina: 20, ordenarPor: "name" }

  it("entrega à tabela a página contada do zero e a ordenação", () => {
    const { tableOptions } = bindAppTableToUrl(params, () => {})

    expect(tableOptions.state).toEqual({
      pagination: { pageIndex: 2, pageSize: 20 },
      sorting: [{ id: "name", desc: false }],
    })
  })

  it("grava a página contada do um, criando entrada no histórico", () => {
    const onChange = vi.fn()
    const { tableOptions } = bindAppTableToUrl(params, onChange)

    tableOptions.onPaginationChange((current) => ({
      ...current,
      pageIndex: current.pageIndex + 1,
    }))

    expect(onChange).toHaveBeenCalledWith(
      { pagina: 4, porPagina: 20 },
      { replace: false }
    )
  })

  it("trocar a ordenação volta para a primeira página", () => {
    const onChange = vi.fn()
    const { tableOptions } = bindAppTableToUrl(params, onChange)

    tableOptions.onSortingChange([{ id: "name", desc: true }])

    expect(onChange).toHaveBeenCalledWith(
      { ordenarPor: "name", ordem: "desc", pagina: 1 },
      { replace: false }
    )
  })

  it("a busca volta para a primeira página sem criar entrada no histórico", () => {
    const onChange = vi.fn()
    const { search } = bindAppTableToUrl(params, onChange)

    search.onChange("maria")

    expect(onChange).toHaveBeenCalledWith(
      { q: "maria", pagina: 1 },
      { replace: true }
    )
  })
})
