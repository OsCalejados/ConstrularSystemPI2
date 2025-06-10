import DeleteDialog from '../dialogs/delete-dialog'
import Link from 'next/link'

import { MoreHorizontal, MoreVertical } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { deleteProduct } from '@/services/product-service'
import { AlertDialog } from '@/components/shadcnui/alert-dialog'
import { useDialog } from '@/hooks/use-dialogs'
import { useRouter } from 'next/navigation'
import { Product } from '@/types/product'
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
  PencilSimpleIcon,
  TrashSimpleIcon,
  EyeIcon,
} from '@phosphor-icons/react/dist/ssr'

interface ProductOptionsProps {
  product: Product
  variant?: 'primary' | 'ghost'
  useLongLabel?: boolean
  showViewItem?: boolean
  showBalanceItem?: boolean
}

export default function ProductOptions({
  product,
  variant,
  useLongLabel,
  showViewItem,
}: ProductOptionsProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const onDelete = async () => {
    await deleteProduct(product.id)

    queryClient.invalidateQueries({
      queryKey: ['products'],
    })

    router.replace('/products')
  }

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
              className="bg-primary hover:bg-primary-hover gap-1 px-0 w-10"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>

        {/* Dropdown Content */}
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuLabel>Ações do produto</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View option */}
          {showViewItem && (
            <DropdownMenuItem asChild>
              <Link
                href={`/products/${product.id}`}
                onClick={(event) => event.stopPropagation()}
                className="gap-2"
              >
                <EyeIcon size={16} />
                <span>
                  {useLongLabel ? 'Visualizar produto' : 'Visualizar'}
                </span>
              </Link>
            </DropdownMenuItem>
          )}

          {/* Edit option */}
          <DropdownMenuItem asChild>
            <Link
              href={`/products/edit/${product.id}`}
              onClick={(event) => event.stopPropagation()}
              className="gap-2"
            >
              <PencilSimpleIcon size={16} />
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
            <TrashSimpleIcon size={16} />
            <span>{useLongLabel ? 'Excluir produto' : 'Excluir'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog {...deleteDialog.props}>
        <DeleteDialog onConfirm={onDelete} variant="customer" />
      </AlertDialog>
    </>
  )
}
