import MemberShipItem from '@/app/admin/(authenticated)/gym/_components/membership/membership-item'
import { useGetGymByIdQuery } from '@/store/services/gym.service'
import { useSearchParams } from 'next/navigation'

export default function PlanList() {
  const searchParams = useSearchParams()
  const gymId = searchParams.get('gym_id')
  const { data } = useGetGymByIdQuery(gymId ?? '', {
    skip: !gymId,
    selectFromResult: ({ data, ...otherArgs }) => {
      return { data: data?.gym?.membershipPlans, ...otherArgs }
    },
  })

  return (
    <div className="flex flex-row flex-wrap items-stretch">
      {data?.map((membership) => (
        <div
          key={membership.id}
          className="flex basis-full items-center justify-center p-4 lg:basis-1/2">
          <MemberShipItem key={membership.id} plan={membership} />
        </div>
      ))}
    </div>
  )
}
