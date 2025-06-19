'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Movement } from '@/types/movement'
import Badge from '../ui/badge'
import { Button } from '../shadcnui/button'
import { ArrowUpDown } from 'lucide-react'

export const movementColumns: ColumnDef<Movement>[] = [
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="pl-0"
      >
        Descrição
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('description')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="pl-0"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const badgeClass =
        status === 'Entrada'
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      return <Badge className={badgeClass}>{status}</Badge>
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="pl-0"
      >
        Data
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue('date') as string
      return (
        <span>
          {new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: () => <Button variant="ghost">•••</Button>,
  },
]
