import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Form } from '@/components/ui/form'
import {
  gymAreaVisualsSchema,
  GymReceptionVisualsType,
  TagsType,
} from '@/lib/zod-schemas/gym-visuals.schema'
import { GymPictureType } from '@/lib/zod-schemas/gym.schema'
import {
  useDeleteGymMediaMutation,
  useGetGymByIdQuery,
  useUploadGymMediaMutation,
} from '@/store/services/gym.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FC } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import AddVisual from './add-visual'
import { cn } from '@/lib/utils'
// interface BaseSchema extends Omit<GymReceptionVisualsType, 'medias'> {
//   medias: {
//     areaType: string
//     id?: string | undefined
//     media: File
//   }[]
// }

interface Props {
  listName?: string // Made optional with a default value
  tag: TagsType
  maxMediaLength?: number
  onHover: {
    listDesc: string
    listItems: string[]
  }
  // zodSchema: ZodType<T, ZodTypeDef, T>; // Correctly typed Zod schema for generics
}

const GymVisualsList: FC<Props> = ({
  listName = 'Reception & Welcome Area',
  tag,
  maxMediaLength,
  onHover,
}) => {
  const searchParams = useSearchParams()
  const gymId = searchParams.get('gym_id')
  const [upload] = useUploadGymMediaMutation()
  const { data } = useGetGymByIdQuery(gymId ?? '', {
    skip: !gymId,
    selectFromResult: ({ data, ...otherArgs }) => {
      const mediaByTag = data?.gym.pictures.filter(
        ({ tag: tagType }) => tagType === tag,
      )
      return { data: mediaByTag, ...otherArgs }
    },
  })

  const form = useForm<GymReceptionVisualsType>({
    resolver: zodResolver(gymAreaVisualsSchema),
    defaultValues: {
      tag,
      description: '',
    },
  })

  const onSubmit = async (submittedData: GymReceptionVisualsType) => {
    const { medias, ...data } = submittedData
    console.log(medias.media[0])
    toast.loading('Uploading media', { id: 'uploading' })
    if (!gymId) {
      toast.error('Gym ID is missing.')
      return
    }
    await upload({
      gym_id: gymId,
      media: medias.media[0],
      ...data,
    })
      .unwrap()
      .then((r) => {
        form.reset()
        toast.success('Media uploaded.', { id: 'uploading' })
      })
      .catch((e) => {
        toast.error('Media upload failed.', { id: 'uploading' })
      })
  }
  const onInvalid = (fieldErrors: FieldErrors<GymReceptionVisualsType>) => {
    console.debug(fieldErrors)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="w-full">
        <Card className={'w-full p-2'}>
          <CardHeader
            className={
              'h-12 flex-row items-center justify-between space-y-0 p-0 pr-3'
            }>
            <CardTitle>{listName}</CardTitle>
            {data?.length !== maxMediaLength ? (
              <div
                className={cn(
                  'self-center',
                  data && data.length > 0 && 'pl-4',
                )}>
                <AddVisual onHover={onHover} listName={listName} />
              </div>
            ) : undefined}
          </CardHeader>
          <CardContent className="flex flex-row p-0">
            <Carousel
              opts={{
                align: 'start',
              }}
              className="z-10 w-full max-w-full bg-inherit">
              <CarouselContent className={'items-stretch space-x-4 pl-2 pr-4'}>
                {data?.map((media) => (
                  <CarouselItem key={media.id} className={`basis-40`}>
                    {/* <div className={`bg-inherit p-1`}> */}
                    <GymVisual {...media} />
                    {/* </div> */}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {/* Your content here */}
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

const GymVisual: FC<GymPictureType> = ({ ...media }) => {
  const searchParams = useSearchParams()
  const gymId = searchParams.get('gym_id')
  const [deleteVisual] = useDeleteGymMediaMutation()

  const handleDelete = async () => {
    if (!gymId) return
    await deleteVisual({ gymId, mediaId: media.id })
  }

  return (
    <div
      className={
        'relative flex aspect-video w-full flex-col first:pl-0 last:pl-0'
      }>
      <div className={'relative size-40 rounded-xl border border-border'}>
        <Image
          fill
          className={'z-10 rounded-xl object-cover'}
          src={media.pictureURL}
          alt={media.description}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="group/button absolute -right-1.5 top-1 z-10 h-6 w-6 rounded-full bg-accent"
        onClick={handleDelete}>
        <Trash2 className="h-4 w-4 group-hover/button:text-destructive" />
      </Button>
    </div>
  )
}

export { GymVisualsList }
