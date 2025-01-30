import type {BaseGymMembershipType, BaseGymReviewType, GymDetailsType,} from '@/lib/zod-schemas/gym.schema'
import type {MakeRequired} from '@/types'

export interface Gym extends Omit<MakeRequired<GymDetailsType, 'id'>, 'timing'> {
  membershipPlans: MakeRequired<BaseGymMembershipType, 'id'>[]
  reviews: MakeRequired<BaseGymReviewType, 'id'>[]
  timing: {
    startTime: string;
    shift: "MORNING" | "EVENING" | "AFTERNOON" | "NIGHT" | "DAY";
    endTime: string;
  } | undefined

}

export interface BaseGymResponse {
  gym: Gym
  gyms: Gym[]
  status: boolean
  message: string
}

export type GymResponse<T extends 'gym' | 'gyms'> = T extends 'gym'
  ? Omit<BaseGymResponse, 'gyms'>
  : Omit<BaseGymResponse, 'gym'>

