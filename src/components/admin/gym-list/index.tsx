'use client'
import { columns } from '@/components/admin/gym-list/columns'
import { DataTable } from '@/components/ui/data-table'
import { useGetGymsQuery } from '@/store/services/gym.service'

const GymList = () => {
  const { data, isSuccess } = useGetGymsQuery()
  return <DataTable columns={columns} data={isSuccess ? data?.gyms : []} />
}
export default GymList
