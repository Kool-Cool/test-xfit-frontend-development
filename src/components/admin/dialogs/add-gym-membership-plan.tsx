import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  BaseGymMembershipType,
  frequencySchema,
  gymMembershipSchema,
  GymMemberShipsType,
} from '@/lib/zod-schemas/gym.schema'
import {
  useCreateMembershipMutation,
  useUpdateGymMembershipMutation,
} from '@/store/services/gym.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, PlusCircle, Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { FC, ReactNode, useEffect, useState } from 'react'
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { changeCase } from '@/lib/utils'

interface BaseProps {
  trigger?: ReactNode
  defaultValues?: Omit<BaseGymMembershipType, 'price'> & { price: string }
  type: 'update' | 'create'
}

interface Props extends BaseProps {
  trigger: ReactNode
  defaultValues: BaseGymMembershipType & { price: string }
}

const durationTypeOptions = frequencySchema.options

const AddGymMembershipPlan: FC<Props | BaseProps> = ({
  trigger,
  defaultValues,
  type = 'create',
}) => {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const gymId = searchParams.get('gym_id')
  const [createMembership, { isLoading, isSuccess }] =
    useCreateMembershipMutation()
  const [updateMembership, { isLoading: isUpdating }] =
    useUpdateGymMembershipMutation()
  const form = useForm<BaseGymMembershipType>({
    resolver: zodResolver(gymMembershipSchema),
    defaultValues: (defaultValues as BaseGymMembershipType) ?? {
      nameOfPlan: '',
      benefits: [] as string[],
      price: '0' as unknown as number,
      durationType: 'weekly',
      isActive: undefined,
      slug: undefined,
    },
  })

  const onSubmit = async (data: BaseGymMembershipType) => {
    console.info('Membership Submission', data)
    const toastId =
      type === 'create' ? { id: 'plan-create' } : { id: 'plan-update' }
    toast.loading('Creating membership', toastId)
    if (!gymId) {
      toast.error('Gym Id is missing', toastId)
      return
    }

    if (type === 'create') {
      await createMembership({ ...data, gymId })
        .unwrap()
        .then((r) => {
          console.debug(r)
          setOpen(false)
          toast.success('Membership created', toastId)
        })
        .catch((e) => {
          console.info(e)
          toast.error(e, toastId)
        })
    } else {
      if (!data.id) return
      await updateMembership({ ...data, id: data.id ?? '', gymId })
        .unwrap()
        .then((r) => {
          console.debug(r)
          setOpen(false)
          toast.success('Membership updated', toastId)
        })
        .catch((e) => {
          console.info(e)
          toast.error(e, toastId)
        })
    }
  }

  const onInvalid = (fieldErrors: FieldErrors<GymMemberShipsType>) => {
    console.info('Membership Submit Error', fieldErrors)
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    //@ts-expect-error name mismatch but working
    name: 'benefits',
  })
  useEffect(() => {
    if (isSuccess) {
      setOpen(false)
    }
    return () => form.reset()
  }, [isSuccess])
  return (
    <Dialog open={open ?? false} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
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
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'create'
              ? 'Add membership details'
              : `Update ${defaultValues?.nameOfPlan}`}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className={'flex flex-col gap-y-4'}>
            <div className="relative grid gap-4 rounded-lg border p-4">
              <FormField
                control={form.control}
                name={`nameOfPlan`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={'Enter a unique plan name.'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan price</FormLabel>
                    <FormControl>
                      <Input placeholder={'Enter a plan price.'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={'Enter plan decription.'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*<FormField*/}
              {/*  control={form.control}*/}
              {/*  name={`nameOfPlan`}*/}
              {/*  render={({field}) => (*/}
              {/*    <FormItem>*/}
              {/*      <FormLabel>Plan name</FormLabel>*/}
              {/*      <FormControl>*/}
              {/*        <Input*/}
              {/*          placeholder={"Enter a unique plan name."}*/}
              {/*          {...field}*/}
              {/*        />*/}
              {/*      </FormControl>*/}
              {/*      <FormMessage/>*/}
              {/*    </FormItem>*/}
              {/*  )}*/}
              {/*/>*/}
              <FormField
                control={form.control}
                name={`durationType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durationTypeOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {changeCase(item, 'title', (value) =>
                              value.replaceAll('-', ' '),
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={'flex flex-col gap-y-2'}>
                <FormLabel>Benefits</FormLabel>
                {fields.map((field, benefitIndex) => (
                  <div key={field.id} className="mb-2 flex items-center gap-2">
                    <FormControl>
                      <Input
                        placeholder="Enter a benefit"
                        {...form.register(`benefits.${benefitIndex}` as const)}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(benefitIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={'gap-x-2'}
                  onClick={() => append('')} // Appending a blank string as a new benefit
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Benefit</span>
                </Button>
              </div>
            </div>
            <Button type={'submit'} disabled={isLoading}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddGymMembershipPlan
