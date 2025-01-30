'use client'

import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { GymDetailsType } from '@/lib/zod-schemas/gym.schema'
import type { Gym } from '@/types/gym'
import { Pencil2Icon } from '@radix-ui/react-icons'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Trash } from 'lucide-react'
import Link from 'next/link'

export const columns: ColumnDef<Gym>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => <>{row.getValue('rating')} </>,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <>{row.getValue('description')} </>,
  },
  {
    accessorKey: 'owner',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner Name" />
    ),
    cell: ({ row }) => (
      <>{(row.getValue('owner') as GymDetailsType['owner'])?.name} </>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return <div>{format(date, 'dd MMM yyyy')}</div>
    },
  },
  {
    id: 'actions',
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          onClick={async () => {}}
          variant={'ghost'}
          size="icon"
          className={'size-6'}>
          <Trash className="size-4 cursor-pointer text-red-500" />
        </Button>
        <Button variant={'ghost'} size="icon" className={'size-6'} asChild>
          <Link href={`/admin/gym/add?gym_id=${row.original.id}`}>
            <Pencil2Icon className="size-4 cursor-pointer text-blue-500" />
          </Link>
        </Button>
      </div>
    ),
  },
]
