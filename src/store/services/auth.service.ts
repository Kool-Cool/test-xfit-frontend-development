import { baseQuery } from '@/lib/rtk-utils'
import type { AdminLoginForm } from '@/lib/zod-schemas/user.zod-schema'
import type { LoginResponse } from '@/types/api'
import { createApi } from '@reduxjs/toolkit/query/react'

export const adminApis = createApi({
  reducerPath: 'admin-api',
  baseQuery: baseQuery(),
  endpoints: (build) => ({
    adminLogIn: build.mutation<LoginResponse, AdminLoginForm>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
  }),
})

export const { useAdminLogInMutation } = adminApis
