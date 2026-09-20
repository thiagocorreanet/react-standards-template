import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { LogOutIcon } from "lucide-react"
import { toast } from "sonner"
import { errorMessage } from "@/shared/api/client"
import { Button } from "@/shared/components/ui/button"
import { logout } from "../api/auth.services"

export function LogoutButton() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.cancelQueries()
      queryClient.clear()
      await router.navigate({ to: "/login", replace: true })
      await router.invalidate()
    },
    onError: (error) => toast.error(errorMessage(error)),
  })
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Sair"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      <LogOutIcon />
    </Button>
  )
}
