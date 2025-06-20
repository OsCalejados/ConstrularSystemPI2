import DeleteDialog from '../dialogs/delete-dialog'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { deleteMovement } from '@/services/movement-service'
import { AlertDialog } from '@/components/shadcnui/alert-dialog'
import { useDialog } from '@/hooks/use-dialogs'
import { useRouter } from 'next/navigation'
import { Movement } from '@/types/movement'
import { Button } from '../shadcnui/button'
import {
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from '@/components/shadcnui/dropdown-menu'
import { TrashSimpleIcon, EyeIcon } from '@phosphor-icons/react/dist/ssr'
import { toast } from '@/hooks/use-toast'

interface MovementOptionsProps {
  movement: Movement
  variant?: 'ghost'
  showViewItem?: boolean
}

export default function MovementOptions({
  movement,
  variant,
  showViewItem = true,
}: MovementOptionsProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const onDelete = async () => {
    try {
      await deleteMovement(movement.id)

      queryClient.invalidateQueries({
        queryKey: ['movements'],
      })

      toast({
        title: 'Movimentação excluída com sucesso',
      })

      router.replace('/stock/movements')
    } catch (error) {
      toast({
        title: 'Erro ao excluir movimentação',
        variant: 'destructive',
      })
    }
  }

  const deleteDialog = useDialog()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant || 'ghost'}
            className="h-8 w-8 p-0"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuLabel>Ações da movimentação</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {showViewItem && (
            <DropdownMenuItem asChild>
              <Link
                href={`/stock/movements/${movement.id}`}
                onClick={(event) => event.stopPropagation()}
                className="gap-2"
              >
                <EyeIcon size={16} />
                <span>Visualizar</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation()
              deleteDialog.trigger()
            }}
            className="text-danger gap-2"
          >
            <TrashSimpleIcon size={16} />
            <span>Excluir</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog {...deleteDialog.props}>
        <DeleteDialog onConfirm={onDelete} variant="movement" />
      </AlertDialog>
    </>
  )
}
