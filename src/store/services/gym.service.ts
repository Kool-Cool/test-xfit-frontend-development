import { baseQuery, transformErrorResponse } from '@/lib/rtk-utils'
import { jsonToFormData } from '@/lib/utils'
import type {
  CouponSchemaType,
  BaseCouponSchemaType,
} from '@/lib/zod-schemas/coupon.schema'
import { TagsType } from '@/lib/zod-schemas/gym-visuals.schema'
import { BaseGymMembershipType } from '@/lib/zod-schemas/gym.schema'
import type { MakeRequired } from '@/types'
import type { UploadedFileResponse } from '@/types/api'
import type { Gym, GymResponse } from '@/types/gym'
import { createApi } from '@reduxjs/toolkit/query/react'

export const gymApis = createApi({
  reducerPath: 'gym',
  baseQuery: baseQuery(),
  tagTypes: ['Gym'],
  endpoints: (build) => ({
    getGyms: build.query<GymResponse<'gyms'>, void>({
      query: () => ({
        url: '/admin/gym',
      }),
      providesTags: (res) => {
        return res
          ? [
              ...res?.gyms.map(({ id }) => ({ type: 'Gym' as const, id })),
              { type: 'Gym', id: 'LIST' },
            ]
          : [{ type: 'Gym', id: 'LIST' }]
      },
    }),
    getGymById: build.query<GymResponse<'gym'>, string>({
      query: (id) => ({
        url: `/admin/gym/${id}`,
      }),
      transformResponse: (response: GymResponse<'gym'>) => {
        const { timings, ...rest } = response.gym

        if (timings.length === 1 && timings[0]?.shift === 'DAY') {
          const timing = timings[0]
          // const startTime = new Date(
          //   date.toDateString() + ' ' + timing.startTime,
          // )
          // const endTime = new Date(
          //   date.toDateString() + ' ' + timing.endTime,
          // )
          return {
            ...response,
            gym: {
              ...rest,
              renderedForm: 'time',
              timing: {
                startTime: timing.startTime,
                shift: timing.shift,
                endTime: timing.endTime,
              },
              timings: [],
            },
          }
        } else {
          return {
            ...response,
            gym: {
              ...rest,
              timings,
              timing: undefined,
              renderedForm: 'shift',
            },
          }
        }
      },
      providesTags: (_, error, id) =>
        !error ? [{ type: 'Gym', id }] : [{ type: 'Gym' }],
    }),
    createMembership: build.mutation<
      GymResponse<'gym'>,
      BaseGymMembershipType & { gymId: string }
    >({
      query: ({ gymId, ...data }) => ({
        url: `admin/gym/${gymId}/plan`,
        body: data,
        method: 'POST',
      }),

      transformErrorResponse,
      async onQueryStarted({ gymId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            gymApis.util.updateQueryData('getGymById', gymId, (draft) => {
              if (draft.gym && data) {
                // Replace the temporary object with the actual server data
                draft.gym.membershipPlans = [...data.gym.membershipPlans]
              }
            }),
          )
        } catch (error) {
          console.debug(error)
        }
      },
    }),
    updateGymMembership: build.mutation<
      { updated_plan: MakeRequired<BaseGymMembershipType, 'id'> },
      MakeRequired<BaseGymMembershipType, 'id'> & { gymId: string }
    >({
      query: ({ gymId, id, ...data }) => ({
        url: `/admin/gym/${gymId}/plan/${id}`,
        body: data,
        method: 'PUT',
      }),
      transformErrorResponse,
      async onQueryStarted(
        { gymId, id, ...rest },
        { dispatch, queryFulfilled },
      ) {
        try {
          const { data } = await queryFulfilled

          // Dispatch the updated query data with the new gym plan
          dispatch(
            gymApis.util.updateQueryData('getGymById', gymId, (draft) => {
              if (draft.gym && data) {
                // Find the gym membership plan that needs to be updated
                const planToUpdateIndex = draft.gym.membershipPlans.findIndex(
                  (plan) => plan.id === id,
                )

                if (planToUpdateIndex !== -1) {
                  // Update the plan with the new data
                  draft.gym.membershipPlans[planToUpdateIndex] = {
                    ...draft.gym.membershipPlans[planToUpdateIndex], // Keep existing data
                    ...data.updated_plan, // Apply the updated data from the server
                  }
                }
              }
            }),
          )
        } catch (error) {
          console.debug('Error while updating gym membership:', error)
        }
      },
    }),
    addGym: build.mutation<Gym, Partial<Gym>>({
      query: (data) => ({
        url: '/admin/gym/create',
        body: data,
        method: 'POST',
      }),
      transformResponse: (response: { gym: Gym }) => {
        return response.gym
      },

      transformErrorResponse,
    }),
    uploadGymMedia: build.mutation<
      UploadedFileResponse,
      { tag: TagsType; description?: string; media: File; gym_id: string }
    >({
      query: (data) => ({
        url: '/admin/gym/media/single',
        method: 'POST',
        body: jsonToFormData(data),
      }),
      async onQueryStarted(
        { tag, description, gym_id },
        { dispatch, queryFulfilled },
      ) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            gymApis.util.updateQueryData('getGymById', gym_id, (draft) => {
              if (draft.gym && draft.gym.pictures) {
                // Replace the temporary object with the actual server data
                draft.gym.pictures.push({
                  id: data?.uploadedFile.publicId,
                  pictureURL: data.uploadedFile.url,
                  ext: data.uploadedFile.type,
                  tag,
                  description,
                })
              }
            }),
          )
        } catch (error) {}
      },
    }),
    deleteGymMedia: build.mutation<Gym, { gymId: string; mediaId: string }>({
      query: ({ gymId, mediaId }) => ({
        url: `admin/gym/${gymId}/media/${mediaId}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ gymId, mediaId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          gymApis.util.updateQueryData('getGymById', gymId, (draft) => {
            // Assign the filtered array back to the draft's pictures
            draft.gym.pictures = draft.gym.pictures.filter(
              (pic) => pic.id !== mediaId,
            )
            return draft
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),
    updateGym: build.mutation<Gym, Partial<Gym> & { gymId: string }>({
      query: ({ gymId, ...data }) => ({
        url: `/admin/gym/${gymId}`,
        body: data,
        method: 'PUT',
      }),
      transformErrorResponse,
      invalidatesTags: (_, _error, { id }) => [{ type: 'Gym', id }],
    }),
    createCoupons: build.mutation<
      {
        gym: {
          coupon: MakeRequired<BaseCouponSchemaType, 'id'>
        }
      },
      MakeRequired<CouponSchemaType, 'gymId'>
    >({
      query: (data) => ({
        url: `/admin/gym/coupon`,
        body: data,
        method: 'POST',
      }),
      transformErrorResponse,
      async onQueryStarted({ gymId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            gymApis.util.updateQueryData('getGymById', gymId, (draft) => {
              if (draft.gym && data) {
                // Replace the temporary object with the actual server data
                draft.gym.coupons.push(data.gym.coupon)
              }
            }),
          )
        } catch (error) {
          console.debug(error)
        }
      },
    }),
  }),
})

export const {
  useGetGymsQuery,
  useGetGymByIdQuery,
  useAddGymMutation,
  useUploadGymMediaMutation,
  useUpdateGymMembershipMutation,
  useDeleteGymMediaMutation,
  useCreateMembershipMutation,
  useCreateCouponsMutation,
  useUpdateGymMutation,
} = gymApis
