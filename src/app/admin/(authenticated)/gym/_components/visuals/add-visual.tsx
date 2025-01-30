import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FileUploader } from '@/components/ui/file-uploader'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { GymReceptionVisualsType } from '@/lib/zod-schemas/gym-visuals.schema'
import { Plus } from 'lucide-react'
// import {useGetGymByIdQuery} from "@/store/services/gym.service";
// import {useSearchParams} from "next/navigation";
import { FC, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

interface Props {
  listName: string
  onHover: {
    listDesc: string
    listItems: string[]
  }
}

const AddVisual: FC<Props> = ({ listName, onHover }) => {
  const container = useRef<HTMLDivElement | null>(null)
  const form = useFormContext<GymReceptionVisualsType>()
  const submissionSuccessFul = form.formState.isSubmitSuccessful

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (submissionSuccessFul) {
      setOpen(false)
    }
    return () => form.reset()
  }, [submissionSuccessFul])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size={'default'}
            className={
              'inline-flex size-fit items-center gap-x-1 text-nowrap rounded-full p-0 px-2 py-1 text-xs md:px-4 md:py-2'
            }
            variant={'default'}>
            <Plus strokeWidth={'2px'} className={'size-5'} />{' '}
            <span className={'text-nowrap text-xs font-semibold'}>
              Add more
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent container={container.current}>
          <DialogHeader>
            <div className="flex items-center gap-x-2">
              <DialogTitle>{listName}</DialogTitle>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="group/button z-10 h-6 w-6 rounded-full bg-accent">
                    <InfoCircledIcon className="h-4 w-4 group-hover/button:text-destructive" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent side={'top'} className="w-80">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">
                        {onHover.listDesc}
                      </h4>
                      <ul className={'list-inside list-disc text-xs'}>
                        {onHover.listItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <DialogDescription className={'font-medium'}>
              Supported formats: JPG,JPEG.
            </DialogDescription>
          </DialogHeader>
          <FormField
            control={form.control}
            name={`medias.media`}
            render={({ field }) => (
              <div className="space-y-6">
                <FormItem className="w-full">
                  <FormLabel>Media</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFileCount={1}
                      maxSize={6 * 1024 * 1024}
                      // progresses={progresses}
                      // // pass the onUpload function here for direct upload
                      // // onUpload={uploadFiles}
                      // disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <Button disabled={form.formState.isSubmitting} type={'submit'}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
      <div ref={container} />
    </>
  )
}
export default AddVisual
