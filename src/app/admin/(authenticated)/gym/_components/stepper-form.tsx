'use client'
import BasicGymDetails from '@/app/admin/(authenticated)/gym/_components/basic-gym-details'
import GymCouponsStep from '@/app/admin/(authenticated)/gym/_components/coupons/coupons-step'
import GymVisualsStep from '@/app/admin/(authenticated)/gym/_components/gym-visuals-step'
import MemberShipStep from '@/app/admin/(authenticated)/gym/_components/membership/memberShipStep'
import { Button } from '@/components/ui/button'
import { Step, StepItem, Stepper, useStepper } from '@/components/ui/stepper'
import { useGetGymByIdQuery } from '@/store/services/gym.service'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const steps = [
  { label: 'Gym Details' },
  { label: 'Step 2' },
  { label: 'Step 3' },
  { label: 'Step 4' },
] satisfies StepItem[]

export function GymStepperForm() {
  const searchParams = useSearchParams()
  const id = searchParams.get('gym_id')
  const { data, isLoading } = useGetGymByIdQuery(id ?? '', {
    skip: !id,
    selectFromResult({ data, ...otherArgs }) {
      return { data: data?.gym, ...otherArgs }
    },
  })
  return (
    <div className="mx-auto flex w-full flex-col gap-4 md:max-w-screen-lg">
      <Stepper initialStep={2} steps={steps}>
        {steps.map((stepProps, index) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              {index === 0 && (
                <Suspense>
                  <BasicGymDetails
                    key={JSON.stringify(isLoading)}
                    type={id ? 'update' : 'create'}
                    defaultValues={{
                      name: data?.name || '',
                      description: data?.description || '',
                      location: {
                        lat: 80,
                        lng: -170,
                      },
                      locationPin: data?.locationPin || '',
                      timings: data?.timings,
                      timing: data?.timing,
                      owner_name: data?.owner?.name,
                      phone: data?.owner?.phone,
                      email: data?.owner.email,
                      // owner: {
                      //   name: data?.owner?.name || '',
                      //   phone: data?.owner?.phone || '',
                      //   email: data?.owner.email || '',
                      // },
                      amenities: [],
                      renderedForm: data?.renderedForm,
                    }}
                  />
                </Suspense>
              )}
              {index === 1 && (
                <Suspense>
                  <GymVisualsStep />
                </Suspense>
              )}
              {index === 2 && (
                <Suspense>
                  {' '}
                  <MemberShipStep />
                </Suspense>
              )}
              {index === 3 && (
                <Suspense>
                  {' '}
                  <GymCouponsStep />
                </Suspense>
              )}
            </Step>
          )
        })}
        {/*<Footer />*/}
      </Stepper>
    </div>
  )
}

function Footer() {
  const {
    nextStep,
    prevStep,
    resetSteps,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
  } = useStepper()
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="my-2 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
          <h1 className="text-xl">Boohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="flex w-full justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary">
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? 'Finish' : isOptionalStep ? 'Skip' : 'Next'}
            </Button>
          </>
        )}
      </div>
    </>
  )
}
