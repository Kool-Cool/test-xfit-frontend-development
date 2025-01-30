import { emailValidSchema, passwordValidSchema } from '@/lib/zod-schemas'
import { z } from 'zod'

export const adminLoginSchema = z.object({
  email: emailValidSchema,
  password: passwordValidSchema,
})

export type AdminLoginForm = z.infer<typeof adminLoginSchema>
