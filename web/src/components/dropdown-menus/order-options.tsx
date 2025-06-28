import DeleteDialog from '../dialogs/delete-dialog'
import Link from 'next/link'

import {
  Eye,
  PencilSimpleIcon,
  PrinterIcon,
  TrashSimpleIcon,
} from '@phosphor-icons/react/dist/ssr'
import { MoreHorizontal, MoreVertical } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { deleteOrder } from '@/services/order-service'
import { Button } from '../shadcnui/button'
import { Order } from '@/types/order'
import {
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from '@/components/shadcnui/dropdown-menu'

import {
  AlertDialogTrigger,
  AlertDialog,
} from '@/components/shadcnui/alert-dialog'
import { AxiosError } from 'axios'
import { APIErrorResponse } from '@/types/api-error-response'
import { toast } from '@/hooks/use-toast'

interface OrderOptionsProps {
  order: Order
  variant?: 'primary' | 'ghost'
  showViewItem?: boolean
  showPrintItem?: boolean
}

export default function OrderOptions({
  order,
  variant,
  showViewItem,
  showPrintItem,
}: OrderOptionsProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: () => deleteOrder(order.id),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      })

      router.replace('/orders/installments')
    },
    onError: (e: AxiosError<APIErrorResponse>) => {
      console.log(e)
      toast({
        title: e.response?.data?.error?.message,
        variant: 'destructive',
      })
    },
  })

  const onPrint = () => {
    console.log('Enviando mensagem para o main...')
    window.electron.ipcRenderer.send('print-order', order)
    console.log('Mensagem enviada.')
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {variant === 'ghost' ? (
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(event) => event.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="bg-primary gap-1 hover:bg-primary-hover px-0 w-10"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuLabel>Ações do pedido</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View option */}
          {showViewItem && (
            <DropdownMenuItem asChild>
              <Link
                href={`/orders/installments/${order.id}`}
                onClick={(event) => event.stopPropagation()}
                className="gap-2"
              >
                <Eye size={16} />
                <span>Visualizar</span>
              </Link>
            </DropdownMenuItem>
          )}

          {showPrintItem && (
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation()
                onPrint()
              }}
              className="gap-2"
            >
              <PrinterIcon size={16} />
              <span>Imprimir</span>
            </DropdownMenuItem>
          )}
          {/* Edit option */}
          <DropdownMenuItem asChild>
            <Link
              href={`/orders/installments/edit/${order.id}`}
              onClick={(event) => event.stopPropagation()}
              className="gap-2"
            >
              <PencilSimpleIcon size={16} />
              <span>Editar</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Delete option */}
          <DropdownMenuItem asChild>
            <AlertDialogTrigger
              className="w-full text-danger gap-2"
              onClick={(event) => event.stopPropagation()}
            >
              <TrashSimpleIcon size={16} />
              <span>Excluir</span>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog */}
      <DeleteDialog onConfirm={mutate} variant="order" />
    </AlertDialog>
  )
}
