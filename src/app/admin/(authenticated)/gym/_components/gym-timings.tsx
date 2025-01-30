'use client'

import {Button} from '@/components/ui/button'
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card'
import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import {BaseBasicGymDetailsForm,} from '@/lib/zod-schemas/gym.schema'
import {PlusCircle, Trash2} from 'lucide-react'
import {forwardRef, HTMLAttributes,} from 'react'
import {Controller, FieldError, useFieldArray, useFormContext, useWatch,} from 'react-hook-form'

// Schema for a single timing entry


export const GymBreakConfirmation = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const form = useFormContext<BaseBasicGymDetailsForm>()
  const formToRender = useWatch({control: form.control, name: 'renderedForm'})
  console.log(formToRender)
  // useEffect(() => {
  //   if (formToRender === 'shift') {
  //     form.setValue('timing', undefined)
  //     form.setValue('timings', [
  //       {
  //         shift: 'MORNING',
  //         startTime: '',
  //         endTime: '',
  //       },
  //     ])
  //   }
  //   if (formToRender === 'time') {
  //     form.setValue('timings', undefined)
  //     form.setValue('timing.startTime', '')
  //     form.setValue('timing.endTime', '')
  //   }
  // }, [formToRender])
  // useEffect(() => {
  //
  // }, [formToRender])
  return (
    <>
      {!formToRender ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Timing Schedule</CardTitle>
            {'timings-shift' in form.formState.errors && (
              <p className="text-xs font-medium text-red-600">
                *
                {
                  (form.formState.errors['timings-shift'] as FieldError)
                    ?.message
                }
              </p>
            )}
          </CardHeader>
          <CardContent>
            <p>Does this schedule include dedicated break periods?</p>
          </CardContent>
          <CardFooter
            ref={ref}
            className="flex justify-end space-x-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <Button
              onClick={() => form.setValue('renderedForm', 'time')}
              size="sm"
              variant="secondary">
              No
            </Button>
            <Button onClick={() => form.setValue('renderedForm', 'shift')} size="sm">
              Yes
            </Button>
          </CardFooter>
        </Card>
      ) : formToRender === 'shift' ? (
        <GymShifts/>
      ) : (
        <GymTimings/>
      )}
    </>
  )
})
GymBreakConfirmation.displayName = 'GymBreakConfirmation'
export default function GymShifts() {
  const form = useFormContext<BaseBasicGymDetailsForm>()
  // Setup field array for dynamic timing entries
  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: 'timings',
  })

  return (
    <Card className="w-full">
      <CardHeader
        className={'flex flex-row items-center space-x-4 space-y-reverse'}>
        <CardTitle>Timing Schedule (Shift Wise)</CardTitle>
        <Button
          variant={'link'}
          size={'xs'}
          className={'text-nowrap p-0 text-xs underline'}
          onClick={() => form.setValue('renderedForm', 'time')}>
          Add Opening and Closing Time
        </Button>
      </CardHeader>
      {/*<Form {...form}>*/}
      {/*  <form*/}
      {/*    onSubmit={form.handleSubmit(onSubmit, (fieldErrors) => {*/}
      {/*      console.debug(fieldErrors)*/}
      {/*    })}*/}
      {/*    className="space-y-4">*/}
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative grid gap-4 rounded-lg border p-4">
            <FormField
              control={form.control}
              name={`timings.${index}.shift`}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Shift</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MORNING">Morning</SelectItem>
                      <SelectItem value="EVENING">Evening</SelectItem>
                      <SelectItem value="AFTERNOON">Afternoon</SelectItem>
                      <SelectItem value="NIGHT">Night</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name={`timings.${index}.startTime`}
                render={({field, fieldState}) => (
                  <>
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <Input
                        type="time"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value}
                      />
                      {/* {JSON.stringify(fieldState)} */}
                      {(fieldState.error || fieldState.invalid) && (
                        <p className="text-xs font-medium text-red-600">
                          *{fieldState.error?.message}
                        </p>
                      )}
                      <FormMessage/>
                    </FormItem>
                  </>
                )}
              />
              {/* <FormField
                    control={form.control}
                    name={`timings.${index}.startTime`}
                    render={({ field,fieldState }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
              <FormField
                control={form.control}
                name={`timings.${index}.endTime`}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4"/>
              </Button>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() =>
            append({
              shift: 'MORNING',
              startTime: '',
              endTime: '',
            })
          }>
          <PlusCircle className="h-4 w-4"/>
          <span className={'text-nowrap'}>Add Timing</span>
        </Button>
        {/* <Button type="submit">Submit</Button> */}
        {/* <TimePicker12HourWrapper /> */}
        {/*<div className="flex w-full justify-end gap-2">*/}
        {/*  {hasCompletedAllSteps ? (*/}
        {/*    <Button size="sm" onClick={resetSteps}>*/}
        {/*      Reset*/}
        {/*    </Button>*/}
        {/*  ) : (*/}
        {/*    <>*/}
        {/*      <Button*/}
        {/*        disabled={isDisabledStep}*/}
        {/*        onClick={prevStep}*/}
        {/*        size="sm"*/}
        {/*        variant="secondary">*/}
        {/*        Prev*/}
        {/*      </Button>*/}
        {/*      <Button size="sm" type={'submit'}>*/}
        {/*        {isLastStep ? 'Finish' : isOptionalStep ? 'Skip' : 'Next'}*/}
        {/*      </Button>*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</div>*/}
      </CardFooter>
      {/*</form>*/}
      {/*</Form>*/}
    </Card>
  )
}

export const GymTimings = () => {
  const form = useFormContext<BaseBasicGymDetailsForm>()

  return (
    <>
      <Card className="w-full">
        <CardHeader
          className={'flex flex-row items-center space-x-4 space-y-reverse'}>
          <CardTitle>Timing Schedule (Gym Opening)</CardTitle>
          <Button
            variant={'link'}
            size={'xs'}
            className={'text-nowrap p-0 text-xs underline'}
            onClick={() => form.setValue('renderedForm', 'shift')}>
            Switch to Shifts
          </Button>
        </CardHeader>
        {/*<Form {...form}>*/}
        <CardContent className="gap-x-4 px-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`timing.startTime`}
              render={({field, fieldState}) => (
                <FormItem>
                  <FormLabel>Opening Time</FormLabel>
                  <Input
                    type="time"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                  {/* {JSON.stringify(fieldState)} */}
                  {(fieldState.error || fieldState.invalid) && (
                    <p className="text-xs font-medium text-red-600">
                      *{fieldState.error?.message}
                    </p>
                  )}
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`timing.endTime`}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Closing Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between px-0 pb-4">
          {/* <Button type="submit">Submit</Button> */}
          {/* <TimePicker12HourWrapper /> */}
          {/*<div className="mt-2 flex w-full justify-end gap-2">*/}
          {/*  {hasCompletedAllSteps ? (*/}
          {/*    <Button size="sm" onClick={resetSteps}>*/}
          {/*      Reset*/}
          {/*    </Button>*/}
          {/*  ) : (*/}
          {/*    <>*/}
          {/*      <Button*/}
          {/*        disabled={isDisabledStep}*/}
          {/*        onClick={prevStep}*/}
          {/*        size="sm"*/}
          {/*        variant="secondary">*/}
          {/*        Prev*/}
          {/*      </Button>*/}
          {/*      <Button size="sm" type={'submit'}>*/}
          {/*        {isLastStep ? 'Finish' : isOptionalStep ? 'Skip' : 'Next'}*/}
          {/*      </Button>*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</div>*/}
        </CardFooter>
        {/*</Form>*/}
      </Card>
    </>
  )
}
