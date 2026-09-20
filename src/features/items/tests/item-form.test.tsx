import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import { ItemForm } from "../components/item-form"

it("impede envio vazio e envia os valores normalizados", async () => {
  const save = vi.fn()
  const rootRoute = createRootRoute({
    component: () => <ItemForm isPending={false} error={null} onSave={save} />,
  })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  })
  render(<RouterProvider router={router} />)
  const user = userEvent.setup()
  await user.click(await screen.findByRole("button", { name: "Salvar item" }))
  expect(save).not.toHaveBeenCalled()
  expect(
    screen.getByText("Informe pelo menos 2 caracteres.")
  ).toBeInTheDocument()
  await user.type(screen.getByLabelText("Nome"), "  Item de teste  ")
  await user.click(screen.getByRole("button", { name: "Salvar item" }))
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith({
      name: "Item de teste",
      description: "",
      status: "active",
    })
  )
})
