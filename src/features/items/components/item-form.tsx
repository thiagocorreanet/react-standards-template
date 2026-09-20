import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import { RequestError } from "@/shared/components/request-error"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { type ItemInput, itemInputSchema } from "../types/items.schemas"

const STATUS_OPTIONS = [
  { label: "Ativo", value: "active" },
  { label: "Arquivado", value: "archived" },
]

export function ItemForm({
  initialValues,
  isPending,
  error,
  onSave,
}: {
  initialValues?: ItemInput
  isPending: boolean
  error: unknown
  onSave: (input: ItemInput) => void
}) {
  const form = useForm({
    defaultValues:
      initialValues ??
      ({ name: "", description: "", status: "active" } as ItemInput),
    validators: { onSubmit: itemInputSchema },
    onSubmit: ({ value }) => onSave(itemInputSchema.parse(value)),
  })
  return (
    <form
      noValidate
      className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      {Boolean(error) && <RequestError error={error} />}
      <form.Field name="name">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="item-name">Nome</Label>
            <Input
              id="item-name"
              maxLength={100}
              autoComplete="off"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby="name-error"
            />
            <p id="name-error" className="text-destructive text-sm">
              {field.state.meta.errors.map((error) => error?.message).join(" ")}
            </p>
          </div>
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="item-description">Descrição</Label>
            <Textarea
              id="item-description"
              maxLength={500}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby="description-error"
            />
            <p id="description-error" className="text-destructive text-sm">
              {field.state.meta.errors.map((error) => error?.message).join(" ")}
            </p>
          </div>
        )}
      </form.Field>
      <form.Field name="status">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="item-status">Situação</Label>
            <Select
              value={field.state.value}
              onValueChange={(value) =>
                field.handleChange(value === "active" ? "active" : "archived")
              }
              items={STATUS_OPTIONS}
            >
              <SelectTrigger id="item-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>
      <div className="flex justify-end gap-3">
        <Link to="/items" className={buttonVariants({ variant: "outline" })}>
          Cancelar
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando…" : "Salvar item"}
        </Button>
      </div>
    </form>
  )
}
