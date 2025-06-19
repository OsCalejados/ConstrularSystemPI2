import OrderOptions from '../dropdown-menus/order-options'

import { ArrowUpDown } from 'lucide-react'
import { formatDate } from '@/utils/format/format-date'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../shadcnui/button'
import { Order } from '@/types/order'
import { formatCurrency } from '@/utils/format/format-currency'

export const installmentOrdersColumns: ColumnDef<Order>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       onClick={(event) => event.stopPropagation()}
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="pl-0"
        >
          Pedido
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const paid = Boolean(row.getValue('paid'))

      if (!paid) {
        return (
          <div className="bg-status-pending rounded-full bg-opacity-25 px-4 w-fit border border-status-pending flex gap-2 items-center justify-center h-8">
            <div className="w-2 h-2 rounded-full bg-status-pending" />
            <span className="text-status-pending text-sm">Pendente</span>
          </div>
        )
      } else {
        return (
          <div className="bg-status-paid rounded-full bg-opacity-25 px-4 w-fit flex gap-2 border border-status-paid items-center justify-center h-8">
            <div className="w-2 h-2 rounded-full bg-status-paid" />
            <span className="text-status-paid text-sm">Pago</span>
          </div>
        )
      }
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
