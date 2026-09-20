import { errorMessage } from "@/shared/api/client"
import { Button } from "@/shared/components/ui/button"

export function RequestError({
  error,
  onRetry,
}: {
  error: unknown
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
    >
      <p>{errorMessage(error)}</p>
      {onRetry && (
        <Button className="mt-3" variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
