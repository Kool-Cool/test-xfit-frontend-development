import {z} from "zod";

export const gymVisualsSchema = z.object({
  id: z.string().optional(),
  media: z.array(z
    .instanceof(File)
    .refine(
      (file) =>
        file.type.startsWith('image/') || file.type.startsWith('video/'),
      {message: 'Media must be either an image or a video'},
    )).default([]),

  ext: z
    .enum(['pdf', 'jpg', 'png', 'jpeg', 'gif', 'bmp', 'tiff', 'svg', 'webp'])
    .optional(),
  description: z
    .string()
    .min(10, {message: 'Description must be at least 10 characters long'})
    .max(500, {message: 'Description must be at most 500 characters long'}),
  tag: z.enum(['GYMPICTURES', 'GYMDOCUMENT']),
  gym_id: z.string().optional(),
}).transform((data) => ({...data, media: data.media[0]}))

export const createAreaSchema = <T extends string>(areaTypes: readonly [T, ...T[]]) => {
  return z.object({
    id: z.string().optional(),
    areaType: z.enum(areaTypes).default(areaTypes[0]),
    media: z
      .array(
        z.instanceof(File).refine(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("video/"),
          {message: "Media must be either an image or a video"}
        )
      )
      .min(1, {message: "At least one media file is required"}),
  });
};

const receptionAreas = ['check-in', 'waiting-room', 'retail-display', 'locker-room'] as const
export const tagSchema = z.enum([
  'RECEPTION',
  'CARDIO',
  'STRENGTH',
  'FUNCTIONAL',
  'GROUPFITNESS',
  'LOCKERROOM',
  'RECOVERY',
  'AMENITIESS',
  'GYMPICTURES',
  'GYMDOCUMENT',
  'GYMVIDEO'
])

export type TagsType = z.infer<typeof tagSchema>

export const gymAreaVisualsSchema = z.object({
  tag: tagSchema.default('RECEPTION'),
  medias: createAreaSchema(receptionAreas),
  description: z.string().optional(),
})
export type GymReceptionVisualsType = z.infer<typeof gymAreaVisualsSchema>

// const cardioAreas = [
//   "treadmills",
//   "elliptical_trainers",
//   "stationary_bikes",
//   "rowing_machines",
//   "stair_climbers",
// ] as const
//
// export const gymCardioZone = z.object({
//   tag: tagSchema.default('CARDIO'),
//   medias: z.array(createAreaSchema(cardioAreas)).min(2, {message: 'At least two visual of reception area is  required.'}),
//   description: z.string().optional(),
// })
//
// export type GymCardioZone = z.infer<typeof gymCardioZone>
// .min(1, {message: 'At least one visual of reception area is  required.'}).transform((data) =>{
//
//   const medias=data.map(({media})=>media)
//   return {
//     gym_id: data[0].gym_id,
//     medias:medias,
//     tag:'RECEPTION'
//   }
// }),


