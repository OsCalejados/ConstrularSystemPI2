'use client'

import MovementOptions from '../dropdown-menus/movement-options'

import { MovementType } from '@/enums/movement-type'
import { ArrowUpDown } from 'lucide-react'
import { formatDate } from '@/utils/format/format-date'
import { ColumnDef } from '@tanstack/react-table'
import { Movement } from '@/types/movement'
import { Button } from '../shadcnui/button'

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
    accessorKey: 'type',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="pl-0"
      >
        Tipo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string

      if (type === MovementType.IN) {
        return (
          <div className="bg-status-paid rounded-full bg-opacity-25 px-4 w-fit flex gap-2 border border-status-paid items-center justify-center h-8">
            <div className="w-2 h-2 rounded-full bg-status-paid" />
            <span className="text-status-paid text-sm">Entrada</span>
          </div>
        )
      } else {
        return (
          <div className="bg-status-pending-alternative rounded-full bg-opacity-25 px-4 w-fit border border-status-pending-alternative flex gap-2 items-center justify-center h-8">
            <div className="w-2 h-2 rounded-full bg-status-pending-alternative" />
            <span className="text-status-pending-alternative text-sm">
              Saída
            </span>
          </div>
        )
      }
    },
  },
  {
    accessorKey: 'createdAt',
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
      const createdAt = row.getValue('createdAt') as string
      return <span>{formatDate(createdAt)}</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const movement = row.original
      return (
        <MovementOptions movement={movement} variant="ghost" showViewItem />
      )
    },
  },
]
