'use client'

import { Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AddGymMembershipPlan from '@/components/admin/dialogs/add-gym-membership-plan'

interface Plan {
  price: number
  description: string
  duration: number
  nameOfPlan: string
  benefits: string[]
  durationType: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'halfyearly'
  id: string
  isActive?: boolean
  slug?: string
}

interface PlanCardProps {
  plan: Plan
  onEdit?: (id: string) => void
}

export default function MemberShipItem({ plan, onEdit }: PlanCardProps) {
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
    <Card className="relative h-full w-full max-w-md transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{plan.nameOfPlan}</CardTitle>
        <AddGymMembershipPlan
          type="update"
          key={plan.id}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => onEdit?.(plan.id)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit plan</span>
            </Button>
          }
          defaultValues={{
            ...plan,
            price: plan.price.toString(),
          }}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold">{formatPrice(plan.price)}</span>
            <span className="text-sm text-muted-foreground">
              /{plan.duration} {formatDurationType(plan.durationType)}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{plan.description}</p>

          {plan.isActive && (
            <Badge variant="secondary" className="mb-2">
              Active
            </Badge>
          )}

          <div className="space-y-2">
            <h4 className="text-xs font-medium">Benefits:</h4>
            <ul className="space-y-2">
              {plan.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-xs">
                  <span className="mr-2">•</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
