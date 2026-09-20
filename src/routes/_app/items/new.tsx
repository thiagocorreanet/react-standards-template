import { createFileRoute } from "@tanstack/react-router"
import { ItemForm, useSaveItem } from "@/features/items"

export const Route = createFileRoute("/_app/items/new")({ component: NewItem })
function NewItem() {
  const mutation = useSaveItem()
  const navigate = Route.useNavigate()
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Novo item</h1>
        <p className="mt-2 text-muted-foreground">
          Preencha as informações do registro.
        </p>
      </div>
      <ItemForm
        isPending={mutation.isPending}
        error={mutation.error}
        onSave={(input) =>
          mutation.mutate(
            { input },
            {
              onSuccess: () => {
                void navigate({ to: "/items" })
              },
            }
          )
        }
      />
    </div>
  )
}
