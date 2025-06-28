'use client'

import CustomPagination from '../ui/pagination'
import TableSearchField from '../ui/table-search-field'
import React from 'react'

import { usePathname, useRouter } from 'next/navigation'
import {
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
  SortingState,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'

import {
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Table,
} from '@/components/shadcnui/table'
import { Order } from '@/types/order'
import { OrderType } from '@/enums/order-type'

type DataType = Order

interface DataTableProps<TData extends DataType, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function OrdersTable<TData extends DataType, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  })

  return (
    <div>
      <div className="rounded-md border">
        <div className="px-4 flex items-center justify-between">
          <TableSearchField
            placeholder="Buscar por nome..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="w-full max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-primary font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const orderSubroute =
                  row.original.type === OrderType.INSTALLMENT
                    ? 'installments'
                    : OrderType.SALE
                      ? 'sales'
                      : 'quotes'
                const orderPath = `/orders/${orderSubroute}/${row.original.id}`
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="cursor-pointer"
                    onClick={() => router.push(orderPath)}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={
                          index === 0 ? 'text-primary' : 'text-secondary'
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CustomPagination
        className="mt-4"
        previousPage={table.previousPage}
        nextPage={table.nextPage}
        firstPage={table.firstPage}
        lastPage={table.lastPage}
        setPageIndex={table.setPageIndex}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        totalPages={table.getPageCount()}
        pageIndex={table.getState().pagination.pageIndex}
      />
    </div>
  )
}
