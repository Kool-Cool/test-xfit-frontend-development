import {GymStepperForm} from '@/app/admin/(authenticated)/gym/_components/stepper-form'
import HeaderDetails from '@/components/admin/header'
import {Suspense} from 'react'

export default async function NewGymStepperForm() {
  return (
    <div className="w-full">
      <HeaderDetails className={'sticky items-start md:items-center'}>
        <div className="flex w-full flex-col items-start px-2">
          <h2 className={'text-lg font-semibold md:text-xl'}>Add New Gym</h2>
          <p className="text-sm text-gray-400">
            Please fill out the form below to add a new gym to the system.
          </p>
        </div>
      </HeaderDetails>
      <div className="p-2 md:p-4">
        <Suspense>
          <GymStepperForm/>
        </Suspense>
      </div>
    </div>
  )
}
