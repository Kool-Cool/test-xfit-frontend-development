import { z } from 'zod'

// Discount Type Enum
export const discountEnums = z.enum(['PERCENT', 'FIX'])
export type DiscountType = z.infer<typeof discountEnums>

// Coupon Provider Enum
export const couponBy = z.enum(['GYM', 'XFIT'])
export type CouponType = z.infer<typeof couponBy>

// Coupon Code Validation
export const couponNameSchema = z
  .string({ message: 'Coupon name is required.' })
  .min(4, { message: 'Coupon code should have at least 4 characters.' })
  .refine((arg) => !arg.includes(' '), {
    message: "Coupon code shouldn't contain spaces.",
  })
  .transform((value) => value.toUpperCase())

// Helper function to format dates
const formatDate = (date: Date, endOfDay = false) =>
  new Date(
    date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, 999),
  ).toISOString()

// Base Coupon Schema
export const baseCouponSchema = z.object({
  id: z.string().optional(),
  couponCode: couponNameSchema,
  description: z
    .string()
    .min(5, { message: 'Description must be at least 5 characters long' })
    .default(''),
  discount: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z
      .number({ message: 'Discount amount/percentage is required.' })
      .positive({ message: 'Discount must be at least 1' }),
  ),
  type: discountEnums,
  providedBy: couponBy,
  gymId: z.string().optional(),
  planId: z.string().optional(),
  validFrom: z
    .string()
    .transform((date) => formatDate(new Date(date), false)) // Ensure 00:00:00 time
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format for validFrom',
    }),
  validTo: z
    .string()
    .default('')
    .transform((date) => formatDate(new Date(date), true)) // Ensure 23:59:59 time
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format for validTo',
    }),
})

export const coupon = baseCouponSchema
  .omit({ id: true })
  .merge(z.object({ id: z.string() }))

export type BaseCouponSchemaType = z.infer<typeof baseCouponSchema>
// Coupon Schema with Additional Rules
export const couponSchema = baseCouponSchema.superRefine((data, ctx) => {
  const now = new Date()
  const validFromDate = new Date(data.validFrom)
  const validToDate = new Date(data.validTo)

  // Ensure discount is valid based on type
  if (data.type === 'PERCENT' && data.discount > 100) {
    ctx.addIssue({
      path: ['discount'],
      message: 'Discount cannot exceed 100 when type is PERCENT',
      code: z.ZodIssueCode.custom,
    })
  }

  // Ensure validFrom is today or later
  if (validFromDate < new Date(now.setHours(0, 0, 0, 0))) {
    ctx.addIssue({
      path: ['validFrom'],
      message: 'Valid From date cannot be earlier than today',
      code: z.ZodIssueCode.custom,
    })
  }

  // Ensure validTo is not earlier than validFrom
  if (validToDate < validFromDate) {
    ctx.addIssue({
      path: ['validTo'],
      message: 'Valid To date cannot be earlier than Valid From date',
      code: z.ZodIssueCode.custom,
    })
  }

  // Ensure gymId and planId are required when providedBy is XFIT
  if (data.providedBy === 'XFIT' && (!data.gymId || !data.planId)) {
    ctx.addIssue({
      path: ['gymId'],
      message: 'gymId is required when providedBy is XFIT',
      code: z.ZodIssueCode.custom,
    })
    ctx.addIssue({
      path: ['planId'],
      message: 'planId is required when providedBy is XFIT',
      code: z.ZodIssueCode.custom,
    })
  }
})

export type CouponSchemaType = z.infer<typeof couponSchema>
