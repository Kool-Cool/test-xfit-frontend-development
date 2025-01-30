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
  couponSchema,
  CouponSchemaType,
  discountEnums,
} from '@/lib/zod-schemas/coupon.schema'
import {
  useCreateCouponsMutation,
  useGetGymByIdQuery,
  useUpdateGymMembershipMutation,
} from '@/store/services/gym.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { FC, ReactNode, useEffect, useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { changeCase } from '@/lib/utils'

interface BaseProps {
  trigger?: ReactNode
  defaultValues?: Omit<CouponSchemaType, 'price'> & { price: string }
  type: 'update' | 'create'
}

interface Props extends BaseProps {
  trigger: ReactNode
  defaultValues: CouponSchemaType & { price: string }
}

const discountTypeOptions = discountEnums.options

const CreateCouponDialog: FC<Props | BaseProps> = ({
  trigger,
  defaultValues,
  type = 'create',
}) => {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const gymId = searchParams.get('gym_id')
  const { plans } = useGetGymByIdQuery(gymId ?? '', {
    skip: !gymId,
    selectFromResult: ({ data, ...otherArgs }) => {
      return { plans: data?.gym?.membershipPlans, ...otherArgs }
    },
  })
  const [createCoupon, { isLoading, isSuccess }] = useCreateCouponsMutation()
  const [updateMembership, { isLoading: isUpdating }] =
    useUpdateGymMembershipMutation()
  const form = useForm<CouponSchemaType>({
    resolver: zodResolver(couponSchema),
    defaultValues: (defaultValues as CouponSchemaType) ?? {
      couponCode: '',
      discount: 0,
      type: 'FIX',
      providedBy: 'GYM',
      validFrom: new Date().toISOString().split('T')[0],
      validTo: '',
      planId: '',
      gymId,
    },
  })

  const onSubmit = async (data: CouponSchemaType) => {
    console.info('Coupon Submission', data)
    const toastId =
      type === 'create' ? { id: 'coupon-create' } : { id: 'coupon-update' }
    toast.loading('Creating coupon', toastId)
    if (!gymId) {
      toast.error('Gym Id is missing', toastId)
      return
    }

    if (type === 'create') {
      await createCoupon({ ...data, gymId })
        .unwrap()
        .then((r) => {
          console.debug(r)
          setOpen(false)
          toast.success('Coupon created', toastId)
        })
        .catch((e) => {
          console.info(e)
          toast.error(e, toastId)
        })
    } else {
      if (!data.id) return
      // await updateMembership({ ...data, id: data.id ?? '', gymId })
      //   .unwrap()
      //   .then((r) => {
      //     console.debug(r)
      //     setOpen(false)
      //     toast.success('Membership updated', toastId)
      //   })
      //   .catch((e) => {
      //     console.info(e)
      //     toast.error(e, toastId)
      //   })
    }
  }

  const onInvalid = (fieldErrors: FieldErrors<CouponSchemaType>) => {
    console.info('Membership Submit Error', fieldErrors)
  }

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
          <DialogTitle>Coupon Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className={'flex flex-col gap-y-4'}>
            <div className="relative grid gap-4 rounded-lg border p-4">
              <FormField
                control={form.control}
                name={`couponCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={'Enter a unique coupon code.'}
                        {...field}
                      />
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
                    <FormLabel>Coupon description</FormLabel>
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

              <FormField
                control={form.control}
                name={`type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {discountTypeOptions.map((item) => (
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
              <FormField
                control={form.control}
                name={`discount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (amount/percentage)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={'Enter a discount amount/percentage.'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`validFrom`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Valid From</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={new Date()} // Sets min date to today
                        placeholder={'Enter a discount amount/percentage.'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`validTo`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Valid To</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder={'Enter a discount amount/percentage.'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`planId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select membership" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {plans?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {changeCase(item.nameOfPlan, 'title', (value) =>
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

export default CreateCouponDialog
