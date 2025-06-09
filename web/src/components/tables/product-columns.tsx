import { formatCurrency } from '@/utils/format-currency'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Product } from '@/types/product'
import { Button } from '../shadcnui/button'

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="pl-0"
        >
          Produto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      const brand = row.original.brand
      return (
        <div>
          <span className="font-medium">{name}</span>
          <div className="text-sm text-gray-500">{brand}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'stockQuantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="pl-0"
        >
          Estoque
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const quantity = row.getValue('stockQuantity') as number
      const unit = row.original.unit
      const isLowStock = quantity <= 10

      return (
        <div className={isLowStock ? 'text-red-600' : ''}>
          <span className="font-medium">
            {quantity} {unit}
          </span>
          {isLowStock && (
            <div className="text-xs text-red-500">Estoque baixo</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'costPrice',
    header: 'Preço de Custo',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('costPrice'))
      const formatted = formatCurrency(amount)

      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: 'salePrice',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="pl-0"
        >
          Preço de Venda
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('salePrice'))
      const formatted = formatCurrency(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'profitMargin',
    header: 'Margem',
    cell: ({ row }) => {
      const margin = row.getValue('profitMargin') as number

      return <div>{margin}%</div>
    },
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <div className="text-right">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <svg
              className="h-4 w-4"
              fill="none"
              strokeWidth="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </Button>
        </div>
      )
    },
  },
]
