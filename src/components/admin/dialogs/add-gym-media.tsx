'use client'

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {FileUploader} from "@/components/ui/file-uploader";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {BaseGymVisualsType, gymVisualsSchema} from "@/lib/zod-schemas/gym.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Plus} from "lucide-react";
import {useSearchParams} from "next/navigation";
import {ReactNode, useState} from "react";
import {SubmitErrorHandler, useForm} from "react-hook-form";

interface Props<T> {
  trigger?: ReactNode
  data?: T
}

export default function AddGymMedia<T extends BaseGymVisualsType>({trigger}: Props<T>) {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const id = searchParams.get("gym_id")
  const form = useForm<BaseGymVisualsType>({
    resolver: zodResolver(gymVisualsSchema),
    defaultValues: {
      description: '',
      gym_id: id ?? undefined
    },
  })

  // const {fields, append, remove} = useFieldArray({
  //   control: form.control,
  //   name: 'medias',
  // })
  const onSubmit = async (result: BaseGymVisualsType) => {
    try {
      console.info("Media Form", result)
      // const fieldArrays = {
      //   media: [] as File[],
      //   description: [] as string[],
      //   tag: [] as ('GYMPICTURES' | 'GYMDOCUMENT')[],
      //   gym_id: [] as string[],
      // }
      //
      // for (const item of result.medias) {
      //   fieldArrays.media.push(item.media)
      //   fieldArrays.description.push(item.description)
      //   fieldArrays.tag.push(item.tag)
      //   fieldArrays.gym_id.push(item.gym_id)
      // }
    } catch (e) {
      console.log(e)
    }
  }
  const onInvalid: SubmitErrorHandler<BaseGymVisualsType> = (
    fieldErrors,
  ) => {
    console.debug(
      'Form Submit Error',
      fieldErrors,
    )
  }
  return (
    <Dialog open={open ?? false} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button
            size={'default'}
            className={
              'inline-flex items-center rounded-full gap-x-1 text-nowrap p-0 text-xs size-fit px-2 py-1 md:px-4 md:py-2 '
            }
            variant={'default'}>
            <Plus strokeWidth={'2px'} className={'size-5'}/>{' '}
            <span
                className={
                  ' text-nowrap text-xs font-semibold'
                }>
                Add more
              </span>
        </Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Gym Media</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="flex w-full flex-col gap-y-4">
            <FormField
              control={form.control}
              name={`media`}
              render={({field}) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Media</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFileCount={1}
                        maxSize={4 * 1024 * 1024}
                        // progresses={progresses}
                        // // pass the onUpload function here for direct upload
                        // // onUpload={uploadFiles}
                        // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name={`tag`}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tag"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GYMPICTURES">
                        Gym Pictures
                      </SelectItem>
                      <SelectItem value="GYMDOCUMENT">
                        Gym Document
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`description`}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={6} {...field} />
                  </FormControl>

                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button type={'submit'} className="w-fit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}