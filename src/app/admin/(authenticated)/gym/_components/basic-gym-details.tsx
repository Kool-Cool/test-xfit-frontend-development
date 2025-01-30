'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { useStepper } from '@/components/ui/stepper'
import { Textarea } from '@/components/ui/textarea'
import {
  type BaseBasicGymDetailsForm,
  basicGymSchema,
} from '@/lib/zod-schemas/gym.schema'
import {
  useAddGymMutation,
  useUpdateGymMutation,
} from '@/store/services/gym.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useRef } from 'react'
import { SubmitErrorHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { GymBreakConfirmation } from './gym-timings'

const BasicGymDetails: React.FC<{
  defaultValues?: BaseBasicGymDetailsForm
  type?: 'update' | 'create'
}> = ({
  defaultValues = {
    name: '',
    description: '',
    location: {
      lat: 80,
      lng: -170,
    },
    locationPin: '',
    owner_name: '',
    phone: '',
    email: '',
    // owner: {
    //   name: '',
    //   phone: '',
    //   email: '',
    // },
    timings: undefined,
    timing: undefined,
    amenities: [],
    renderedForm: undefined,
  } satisfies BaseBasicGymDetailsForm,
  type = 'create',
}) => {
  const { replace } = useRouter()
  const {
    nextStep,
    prevStep,
    resetSteps,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
  } = useStepper()
  const searchParams = useSearchParams()
  const gymId = searchParams.get('gym_id')
  const timingsRef = useRef<HTMLDivElement | null>(null)
  const [addGym, { isLoading: isCreating }] = useAddGymMutation()
  const [updateGym, { isLoading: isUpdating }] = useUpdateGymMutation()
  const form = useForm<BaseBasicGymDetailsForm>({
    mode: 'onBlur',
    resolver: zodResolver(basicGymSchema),
    defaultValues,
  })
  console.info('Basic Details ', defaultValues)
  const handleSubmit = async (data: BaseBasicGymDetailsForm) => {
    console.log(data)
    if (type === 'create') {
      toast.loading('Creating gym...', { id: 'create' })
      delete data['renderedForm']
      await addGym({ ...data, timing: undefined, renderedForm: undefined })
        .unwrap()
        .then((r) => {
          console.info(r)
          replace(`?gym_id=${r.id}`)
          nextStep()
          toast.success('Gym added to the system.', { id: 'create' })
        })
        .catch((e) => {
          console.debug(e)
          toast.error('Gym creation failed.', { id: 'create' })
        })
      console.debug('Form 1 Data', data)
    } else {
      toast.loading('Updating gym...', { id: 'update' })
      if (!gymId) {
        toast.error('Gym id is missing.')
        return
      }
      await updateGym({
        ...data,
        gymId,
        timing: undefined,
        renderedForm: undefined,
      })
        .unwrap()
        .then((r) => {
          console.info(r)
          toast.success('Gym details updated.', { id: 'update' })
          nextStep()
        })
        .catch((e) => {
          console.debug(e)
          toast.error('Gym details updation failed.', { id: 'update' })
        })
    }
  }
  const onInvalid: SubmitErrorHandler<BaseBasicGymDetailsForm> = (
    fieldErrors,
  ) => {
    console.debug(
      'Form Submit Error',
      fieldErrors,
      Object.assign(fieldErrors).length === 1,
    )
    if (
      'timings-shift' in fieldErrors &&
      Object.entries(fieldErrors).length === 1
    ) {
      timingsRef.current?.scrollIntoView({
        behavior: 'smooth',
      })
      // timingsRef.current?.focus()
      // toast.error((fieldErrors['timings-shift'] as FieldError)?.message)
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
        className={'mx-auto w-full space-y-4'}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Gym Details</CardTitle>
          </CardHeader>
          <CardContent className={'flex flex-col gap-y-4'}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gym Name</FormLabel>
                  <FormControl>
                    <Input placeholder={'Enter gym name'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={'Write a description of your gym.'}
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gym Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full flex-col flex-wrap items-center md:flex-row">
              <FormField
                control={form.control}
                name="locationPin"
                render={({ field }) => (
                  <FormItem className={'w-full basis-full'}>
                    <FormLabel>Location Pin (URL)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder={'Paste gym location url'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*<FormField*/}
              {/*  control={form.control}*/}
              {/*  name="location.lat"*/}
              {/*  render={({ field }) => (*/}
              {/*    <FormItem className={'basis-full md:basis-1/2 pr-1'}>*/}
              {/*      <FormLabel>Latitude</FormLabel>*/}
              {/*      <FormControl>*/}
              {/*        <Input {...field} />*/}
              {/*      </FormControl>*/}
              {/*      <FormMessage />*/}
              {/*    </FormItem>*/}
              {/*  )}*/}
              {/*/>*/}
              {/*<FormField*/}
              {/*  control={form.control}*/}
              {/*  name="location.lng"*/}
              {/*  render={({ field }) => (*/}
              {/*    <FormItem className={'basis-full md:basis-1/2 pl-1'}>*/}
              {/*      <FormLabel>Longitude</FormLabel>*/}
              {/*      <FormControl>*/}
              {/*        <Input {...field} />*/}
              {/*      </FormControl>*/}
              {/*      <FormMessage />*/}
              {/*    </FormItem>*/}
              {/*  )}*/}
              {/*/>*/}
            </div>
          </CardContent>
        </Card>
        <GymBreakConfirmation ref={timingsRef} />

        <Card>
          <CardHeader>
            <CardTitle>Owner Details</CardTitle>
          </CardHeader>
          <CardContent className={'flex flex-col gap-y-4'}>
            <FormField
              control={form.control}
              name="owner_name"
              render={({ field }) => (
                <FormItem className={''}>
                  <FormLabel>Owner&apos;s Name</FormLabel>
                  <FormControl>
                    <Input placeholder={"Enter gym's owner name"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className={''}>
                  <FormLabel>Phone No.</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder={"Enter gym's owner phone no"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder={"Enter gym/owner's email"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex w-full justify-end gap-2">
          {hasCompletedAllSteps ? (
            <Button type={'button'} size="sm" onClick={resetSteps}>
              Reset
            </Button>
          ) : (
            <>
              <Button
                type={'button'}
                disabled={isDisabledStep}
                onClick={prevStep}
                size="sm"
                variant="secondary">
                Prev
              </Button>
              <Button
                disabled={isCreating || isUpdating}
                size="sm"
                type={'submit'}>
                {isLastStep
                  ? 'Finish'
                  : isOptionalStep
                    ? 'Skip'
                    : type === 'create'
                      ? 'Next'
                      : 'Update & Next'}
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}

export default BasicGymDetails
