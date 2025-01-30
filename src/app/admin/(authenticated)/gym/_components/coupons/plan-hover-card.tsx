'use client'

import type { FC } from 'react'
import { CalendarDays, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useGetGymByIdQuery } from '@/store/services/gym.service'
import { useSearchParams } from 'next/navigation'

interface Props {
  planId: string
}

const PlanHoverCard: FC<Props> = ({ planId }) => {
  const searchParams = useSearchParams()
  const gymId = searchParams.get('gym_id')

  const { plan } = useGetGymByIdQuery(gymId ?? '', {
    skip: !gymId,
    selectFromResult: ({ data, ...otherArgs }) => {
      const foundPlan = data?.gym?.membershipPlans.find(
        (plan) => plan.id === planId,
      )
      return { plan: foundPlan, ...otherArgs }
    },
  })

  if (!plan) {
    return null
  }

  const formatDurationType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="p-0 text-left font-normal">
          {plan.nameOfPlan}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="w-full space-y-2">
            <h4 className="text-sm font-semibold">{plan.nameOfPlan}</h4>
            <p className="text-xs text-muted-foreground">{plan.description}</p>

            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-2 h-3 w-3" />
              <span>
                {plan.duration} {formatDurationType(plan.durationType)}
              </span>
            </div>

            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarDays className="mr-2 h-3 w-3" />
              <span>{formatPrice(plan.price)}</span>
            </div>

            {plan.benefits.length > 0 && (
              <div className="mt-2">
                <p className="mb-1 text-xs font-medium">Benefits:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {plan.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                  {plan.benefits.length > 3 && (
                    <li className="text-xs text-muted-foreground">
                      +{plan.benefits.length - 3} more benefits
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default PlanHoverCard
