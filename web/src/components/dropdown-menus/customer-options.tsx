import UpdateBalanceDialog from '../dialogs/update-balance-dialog'
import DeleteDialog from '../dialogs/delete-dialog'
import Link from 'next/link'

import { MoreHorizontal, MoreVertical } from 'lucide-react'
import { AlertDialog } from '@/components/shadcnui/alert-dialog'
import { useDialog } from '@/hooks/use-dialogs'
import { Customer } from '@/types/customer'
import { Dialog } from '../shadcnui/dialog'
import { Button } from '../shadcnui/button'
import {
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from '@/components/shadcnui/dropdown-menu'

import {
  PencilSimple,
  TrashSimple,
  Wallet,
  Eye,
} from '@phosphor-icons/react/dist/ssr'
import { deleteCustomer } from '@/services/customer-service'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

interface CustomerOptionsProps {
  customer: Customer
  variant?: 'primary' | 'ghost'
  useLongLabel?: boolean
  showViewItem?: boolean
  showBalanceItem?: boolean
}

export default function CustomerOptions({
  customer,
  variant,
  useLongLabel,
  showViewItem,
  showBalanceItem,
}: CustomerOptionsProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const onDelete = async () => {
    await deleteCustomer(customer.id)

    queryClient.invalidateQueries({
      queryKey: ['customers'],
    })

    router.replace('/customers')
  }

  const balanceDialog = useDialog()
  const deleteDialog = useDialog()

  return (
    <>
      {/* Dropdown */}
      <DropdownMenu>
        {/* Trigger */}
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
              className="bg-button-primary gap-1 hover:bg-button-primary-hover px-0 w-10"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>

        {/* Dropdown Content */}
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuLabel>Ações do cliente</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View option */}
          {showViewItem && (
            <DropdownMenuItem asChild>
              <Link
                href={`/customers/${customer.id}`}
                onClick={(event) => event.stopPropagation()}
                className="gap-2"
              >
                <Eye size={16} />
                <span>
                  {useLongLabel ? 'Visualizar cliente' : 'Visualizar'}
                </span>
              </Link>
            </DropdownMenuItem>
          )}

          {/* Edit balance option */}
          {showBalanceItem && (
            <DropdownMenuItem
              className="gap-2"
              onClick={(event) => {
                event.stopPropagation()
                balanceDialog.trigger()
              }}
            >
              <Wallet size={16} />
              <span>Editar saldo</span>
            </DropdownMenuItem>
          )}

          {/* Edit option */}
          <DropdownMenuItem asChild>
            <Link
              href={`/customers/edit/${customer.id}`}
              onClick={(event) => event.stopPropagation()}
              className="gap-2"
            >
              <PencilSimple size={16} />
              <span>{useLongLabel ? 'Editar dados' : 'Editar'}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete option */}
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation()
              deleteDialog.trigger()
            }}
            className="text-danger gap-2"
          >
            <TrashSimple size={16} />
            <span>{useLongLabel ? 'Excluir cliente' : 'Excluir'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      <Dialog {...balanceDialog.props}>
        <UpdateBalanceDialog
          balance={customer.balance}
          customerId={customer.id}
        />
      </Dialog>

      <AlertDialog {...deleteDialog.props}>
        <DeleteDialog onConfirm={onDelete} variant="customer" />
      </AlertDialog>
    </>
  )
}
