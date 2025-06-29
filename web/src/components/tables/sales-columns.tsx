import OrderOptions from '../dropdown-menus/order-options'
import { ArrowUpDown } from 'lucide-react'
import { formatDate } from '@/utils/format/format-date'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../shadcnui/button'
import { Order } from '@/types/order'
import { formatCurrency } from '@/utils/format/format-currency'

export const salesColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="pl-0"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const orderId = row.getValue('id') as number
      const formattedOrderId = `#${orderId.toString().padStart(6, '0')}`
      return <span className="font-medium">{formattedOrderId}</span>
    },
  },
  {
    header: 'Cliente',
    accessorKey: 'name',
    accessorFn: (row) => row.customer?.name ?? '-',
  },
  {
    header: 'Valor',
    accessorKey: 'total',
    cell: ({ row }) => {
      const total = parseFloat(row.getValue('total'))
      const formatted = formatCurrency(total)

      return <div>{formatted}</div>
    },
  },
  {
    header: 'Valor',
    accessorKey: 'total',
    cell: ({ row }) => {
      const total = parseFloat(row.getValue('total'))
      const formatted = formatCurrency(total)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      const formatted = formatDate(date)
      return <div>{formatted}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original
      return <OrderOptions order={order} variant="ghost" showViewItem />
    },
  },
]
