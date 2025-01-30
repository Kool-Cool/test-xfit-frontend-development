import { coupon } from '@/lib/zod-schemas/coupon.schema'
import { emailValidSchema, googleMapsSchema } from '@/lib/zod-schemas/index'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod'

export const owenerSchema = z.object({
  owner: z.object({
    name: z
      .string({ message: "Please add owner's name." })
      .min(1, { message: "Owner's name is required" })
      .max(100, {
        message: "Owner's name must be at most 100 characters long",
      }),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Phone is not a valid number.' }),
    email: emailValidSchema,
  }),
})

export const baseBasicGymSchema = z.object({
  id: z.string().uuid().optional(),
  renderedForm: z.enum(['shift', 'time']).optional(),
  name: z
    .string()
    .min(1, { message: 'Gym name is required' })
    .max(100, { message: 'Gym name must be at most 100 characters long' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters long' })
    .max(500, { message: 'Description must be at most 500 characters long' }),
  capacity: z
    .number()
    .int()
    .positive('Capacity must be a positive integer')
    .optional(),
  location: z
    .object({
      lat: z
        .number()
        .gte(-90)
        .lte(90, { message: 'Latitude must be between -90 and 90' }),
      lng: z
        .number()
        .gte(-180)
        .lte(180, { message: 'Longitude must be between -180 and 180' }),
    })
    .optional(),
  owner_name: z
    .string({ message: "Please add owner's name." })
    .min(1, { message: "Owner's name is required" })
    .max(100, {
      message: "Owner's name must be at most 100 characters long",
    }),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: 'Phone is not a valid number.' }),
  email: emailValidSchema,
  amenities: z.array(z.string()).default([]),
  locationPin: googleMapsSchema.optional(),
})
//   .omit({
//   owner_name: true,
//   phone: true,
//   email: true,
// })
//   .merge(owenerSchema)

/**
 * Schema for validating gym shifts.
 *
 * This schema validates an array of shift objects, each containing:
 * - `shift`: A string enum representing the shift type ('MORNING', 'EVENING', 'AFTERNOON', 'NIGHT').
 * - `startTime`: A string representing the start time in HH:MM format.
 * - `endTime`: A string representing the end time in HH:MM format.
 *
 * The schema ensures:
 * - `startTime` and `endTime` are in valid HH:MM format.
 * - `endTime` is after `startTime`.
 * - Shift-specific timing constraints are met:
 *   - MORNING shift must be between 05:00 AM and 12:00 PM.
 *   - AFTERNOON shift must be between 12:00 PM and 05:00 PM.
 *   - EVENING shift must be between 05:00 PM and 09:00 PM.
 *   - NIGHT shift must be between 09:00 PM and 05:00 AM.
 *
 * @example
 * const validShift = {
 *   timings: [
 *     {
 *       shift: 'MORNING',
 *       startTime: '06:00',
 *       endTime: '11:00'
 *     }
 *   ]
 * };
 *
 * const result = gymShiftsSchema.safeParse(validShift);
 * if (!result.success) {
 *   console.error(result.error);
 * } else {
 *   console.log('Valid shift:', result.data);
 * }
 */
export const gymShiftsSchema = z.object({
  timings: z
    .array(
      z
        .object({
          shift: z.enum(['MORNING', 'EVENING', 'AFTERNOON', 'NIGHT']),
          startTime: z
            .string()
            .regex(
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              'Invalid time format.Valid example: 06:00AM',
            ),
          endTime: z
            .string()
            .regex(
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              'Invalid time format.Valid example: 07:00AM',
            ),
        })
        .superRefine((data, ctx) => {
          const date = new Date('2025-01-21') // Fixed date for validation
          const start = new Date(`${date.toDateString()} ${data.startTime}`)
          const end = new Date(`${date.toDateString()} ${data.endTime}`)

          //Only night shift is 21:00 to 5:00 so we will ignore it
          if (start >= end && data.shift !== 'NIGHT') {
            ctx.addIssue({
              path: ['endTime'],
              message: 'End time must be after start time',
              code: 'custom',
            })
          }

          // Validate shift-specific timing constraints
          if (
            data.shift === 'MORNING' &&
            (start.getHours() < 5 || end.getHours() > 12)
          ) {
            ctx.addIssue({
              path: ['startTime'],
              message: 'Morning shift must be between 05:00 AM and 12:00 PM',
              code: 'custom',
            })
          }
          if (
            data.shift === 'AFTERNOON' &&
            (start.getHours() < 12 || end.getHours() > 17)
          ) {
            ctx.addIssue({
              path: ['startTime'],
              message: 'Afternoon shift must be between 12:00 PM and 05:00 PM',
              code: 'custom',
            })
          }
          if (
            data.shift === 'EVENING' &&
            (start.getHours() < 17 || end.getHours() > 21)
          ) {
            ctx.addIssue({
              path: ['startTime'],
              message: 'Evening shift must be between 05:00 PM and 09:00 PM',
              code: 'custom',
            })
          }
          if (
            data.shift === 'NIGHT' &&
            (start.getHours() < 21 || end.getHours() > 5)
          ) {
            ctx.addIssue({
              path: ['startTime'],
              message: 'Night shift must be between 09:00PM and 05:00 AM',
              code: 'custom',
            })
          }
        }),
    )
    .superRefine((shifts, ctx) => {
      // Check for duplicate shifts
      const seenShifts = new Set<string>()

      shifts.forEach((timing, index) => {
        const shiftKey = `${timing.shift}-${timing.startTime}-${timing.endTime}`
        if (seenShifts.has(shiftKey)) {
          ctx.addIssue({
            path: [`${index}.shift`],
            message: `Duplicate shift detected: ${timing.shift} (${timing.startTime} - ${timing.endTime})`,
            code: 'custom',
          })
        } else {
          seenShifts.add(shiftKey)
        }
      })

      // Check for overlapping shifts
      for (let i = 0; i < shifts.length; i++) {
        const { startTime: startA, endTime: endA } = shifts[i]
        const startAParsed = new Date(`2025-01-21T${startA}`)
        const endAParsed = new Date(`2025-01-21T${endA}`)

        for (let j = i + 1; j < shifts.length; j++) {
          const { startTime: startB, endTime: endB } = shifts[j]
          const startBParsed = new Date(`2025-01-21T${startB}`)
          const endBParsed = new Date(`2025-01-21T${endB}`)

          if (
            startAParsed < endBParsed && // Shift A starts before Shift B ends
            endAParsed > startBParsed // Shift A ends after Shift B starts
          ) {
            ctx.addIssue({
              path: [`${i}.startTime`],
              message: `Shift overlaps with another shift: (${startA} - ${endA}) overlaps with (${startB} - ${endB})`,
              code: 'custom',
            })
            ctx.addIssue({
              path: [`${j}.startTime`],
              message: `Shift overlaps with another shift: (${startB} - ${endB}) overlaps with (${startA} - ${endA})`,
              code: 'custom',
            })
          }
        }
      }
    }),
})
export type BaseGymShiftsType = z.infer<typeof gymShiftsSchema>

export const gymTiming = z.object({
  timing: z
    .object({
      startTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
        .default(''),
      endTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
        .default(''),
      shift: z
        .enum(['DAY', 'MORNING', 'EVENING', 'AFTERNOON', 'NIGHT'])
        .default('DAY'),
      // startTime: z
      //   .string()
      //   .refine((val) => !isNaN(Date.parse(val)), 'Invalid start time'),
      // endTime: z
      //   .string()
      //   .refine((val) => !isNaN(Date.parse(val)), 'Invalid end time'),
    })
    .superRefine((data, ctx) => {
      const date = new Date('2025-01-21') // Fixed date for validation
      const start = new Date(`${date.toDateString()} ${data.startTime}`)
      const end = new Date(`${date.toDateString()} ${data.endTime}`)

      if (start >= end) {
        ctx.addIssue({
          path: ['endTime'],
          message: 'End time must be after start time',
          code: 'custom',
        })
      }
    }),
})
export type BaseGymTimingType = z.infer<typeof gymTiming>

export const basicGymSchema = baseBasicGymSchema
  .merge(gymShiftsSchema)
  .merge(gymTiming)
  .partial({
    timings: true,
    timing: true,
  })
  .transform((data) => {
    const { renderedForm, ...rest } = data
    const timing = rest.timing
      ? {
          startTime: rest.timing.startTime,
          endTime: rest.timing.endTime,
          shift: rest.timing.shift,
        }
      : undefined
    return {
      ...rest,
      renderedForm,
      timings: renderedForm === 'time' && timing ? [timing] : rest.timings,
    }
  })
  .refine((data) => data.timings || data.timing, {
    message:
      'Please specify if your gym has break times and provide the corresponding timings.',
    path: ['timings-shift'], // This is the path where the error will be attached
  })

export type BaseBasicGymDetailsForm = z.infer<typeof basicGymSchema> & {
  renderedForm: 'time' | 'shift' | undefined
}
export const gymReviewSchema = z.object({
  id: z.string().uuid().optional(),
  review: z
    .string()
    .min(10, { message: 'Review must be at least 10 characters long' })
    .max(500, { message: 'Review must be at most 500 characters long' }),
  user: z.string().min(1, { message: 'User is required' }),
})

export const gymReviewsSchema = z.object({
  reviews: z.array(gymReviewSchema).default([]).optional(),
})
export type BaseGymReviewType = z.infer<typeof gymReviewSchema>

const frequencies = [
  'weekly',
  'monthly',
  'quarterly',
  'half-yearly',
  'yearly',
] as const

export const frequencySchema = z.enum(frequencies)

export const gymMembershipSchema = z
  .object({
    id: z.string().optional(),
    duration: z.number().default(1),
    nameOfPlan: z
      .string()
      .min(1, { message: 'Please provide an appropriate membership name' })
      .default(''),
    benefits: z
      .array(
        z.string().min(10, {
          message: 'Each benefit must be at least 10 characters long',
        }),
      )
      .min(1, { message: 'At least one benefit is required' })
      .default([]),
    price: z.string().min(1, { message: 'Price is required' }),
    description: z
      .string({ message: 'Please add a plan description.' })
      .min(10, { message: 'Plan decription must be more that 10 characters.' })
      .default(''),
    durationType: frequencySchema
      .default('yearly')
      .transform((data) => (data === 'half-yearly' ? 'halfyearly' : data)),
    isActive: z.boolean().optional(),
    slug: z.string().optional(), // Default value to avoid issues with `.transform()`
  })
  .transform((data) => {
    // Dynamically generate the `slug` from `nameOfPlan`
    return {
      ...data,
      price: parseFloat(data.price),
      // slug: data.nameOfPlan
      //   .toLowerCase()
      //   .replace(/\s+/g, '-') // Replace spaces with dashes
      //   .replace(/[^a-z0-9-]/g, ''), // Remove invalid characters
    }
  })
  .refine((data) => data.price !== 0, {
    message: 'Price must be greater than zero',
    path: ['price'],
  })
  .refine((data) => data.nameOfPlan.trim().length > 0, {
    message: 'Membership name cannot be empty or just spaces',
    path: ['nameOfPlan'],
  })

export type BaseGymMembershipType = z.infer<typeof gymMembershipSchema>

export const gymMembershipsSchema = z.object({
  membershipPlans: z
    .array(gymMembershipSchema)
    .default([
      {
        nameOfPlan: '',
        benefits: [],
        price: '0',
        durationType: 'monthly',
      },
    ])
    .superRefine((data, ctx) => {
      const planNames = data.map((plan) => plan.nameOfPlan.toLowerCase())
      const duplicates = planNames.filter(
        (name, index) => planNames.indexOf(name) !== index,
      )

      if (duplicates.length > 0) {
        ctx.addIssue({
          path: ['nameOfPlan'],
          message: `Duplicate plan names found: ${duplicates.join(', ')}`,
          code: 'custom',
        })
      }
    }),
})

export type GymMemberShipsType = z.infer<typeof gymMembershipsSchema>

export const gymPictureSchema = z.object({
  id: z.string().min(1, { message: 'ID is required' }), // Ensure the ID is a non-empty string
  pictureURL: z.string().url({ message: 'Picture URL must be a valid URL' }), // Validate the URL
  ext: z.enum(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'], {
    message: 'Extension must be a valid image file type',
  }), // Ensure the extension is one of the allowed types
  tag: z.enum(['GYMPICTURES', 'GYMDOCUMENT'], {
    message: 'Tag must be either GYMPICTURES or GYMDOCUMENT',
  }), // Validate the tag against specific options
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters long' })
    .max(500, { message: 'Description must be at most 500 characters long' }), // Description validation
})

export type GymPictureType = z.infer<typeof gymPictureSchema>
export type GymPicturesType = GymPictureType[]

export const completeGymSchema = baseBasicGymSchema
  .omit({
    owner_name: true,
    phone: true,
    email: true,
  })
  .merge(owenerSchema)
  .merge(gymShiftsSchema)
  .merge(gymTiming)
  .merge(gymReviewsSchema)
  .merge(gymMembershipsSchema)
  .merge(
    z.object({
      pictures: z.array(gymPictureSchema).default([]),
    }),
  )
  .merge(
    z.object({
      coupons: z.array(coupon).default([]),
    }),
  )
  .transform((data) => {
    const timing = {
      startTime: data.timing.startTime ?? '',
      endTime: data.timing.endTime,
      shift: 'DAY' as 'MORNING' | 'EVENING' | 'AFTERNOON' | 'NIGHT' | 'DAY',
    }
    return {
      ...data,
      timing: undefined,
      timings: [timing, ...data.timings],
    }
  })

export type GymDetailsType = z.infer<typeof completeGymSchema>
