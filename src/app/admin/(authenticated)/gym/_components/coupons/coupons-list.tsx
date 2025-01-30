'use client'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { BaseCouponSchemaType } from '@/lib/zod-schemas/coupon.schema'
import { Pencil2Icon } from '@radix-ui/react-icons'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Trash } from 'lucide-react'
import Link from 'next/link'
import type { CouponType } from '@/lib/zod-schemas/coupon.schema'
import PlanHoverCard from '@/app/admin/(authenticated)/gym/_components/coupons/plan-hover-card'
import { useSearchParams } from 'next/navigation'
import { useGetGymByIdQuery } from '@/store/services/gym.service'

export const columns: ColumnDef<BaseCouponSchemaType>[] = [
  {
    accessorKey: 'couponCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Coupon Code" />
    ),
    cell: ({ row }) => <div>{row.getValue('couponCode')}</div>,
  },
  {
    accessorKey: 'planId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan" />
    ),
    cell: ({ row }) => <PlanHoverCard planId={row.getValue('planId')} />,
  },
  {
    accessorKey: 'discount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => <>{row.getValue('discount')} </>,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit (Rs/%)" />
    ),
    cell: ({ row }) => <>{row.getValue('type')} </>,
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
          <Link href={`/admin/gym/add?gym_id=${row.original.gymId}`}>
            <Pencil2Icon className="size-4 cursor-pointer text-blue-500" />
          </Link>
        </Button>
      </div>
    ),
  },
]

const CouponList = () => {
  const searchParams = useSearchParams()
  const gymId = searchParams.get('gym_id')
  const { coupons, isSuccess } = useGetGymByIdQuery(gymId ?? '', {
    skip: !gymId,
    selectFromResult: ({ data, ...otherArgs }) => {
      return { coupons: data?.gym?.coupons, ...otherArgs }
    },
  })
  return <DataTable columns={columns} data={isSuccess ? coupons : []} />
}
export default CouponList
