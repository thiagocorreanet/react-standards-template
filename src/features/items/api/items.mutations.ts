import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { itemsKeys } from "./items.queries"
import { deleteItem, saveItem } from "./items.services"

export function useSaveItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveItem,
    onSuccess: async (item) => {
      queryClient.setQueryData(itemsKeys.detail(item.id), item)
      await queryClient.invalidateQueries({ queryKey: itemsKeys.lists() })
      toast.success("Item salvo.")
    },
  })
}

export function useDeleteItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: async (_, id) => {
      await queryClient.cancelQueries({ queryKey: itemsKeys.detail(id) })
      queryClient.removeQueries({ queryKey: itemsKeys.detail(id) })
      await queryClient.invalidateQueries({ queryKey: itemsKeys.lists() })
      toast.success("Item excluído.")
    },
  })
}
