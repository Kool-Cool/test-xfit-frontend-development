import { GymStepperForm } from '@/app/admin/(authenticated)/gym/_components/stepper-form'
import HeaderDetails from '@/components/admin/header'
export default async function UpdateGymDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="w-full">
      <HeaderDetails className={'sticky items-start md:items-center'}>
        <div className="flex w-full flex-col items-start px-2">
          <h2 className={'text-lg font-semibold md:text-xl'}>Update Gym</h2>
          <p className="text-sm text-gray-400">
            Please fill out the form below to update gym details.
          </p>
        </div>
      </HeaderDetails>
      <div className="p-2 md:p-4">
        <GymStepperForm id={id} />
      </div>
    </div>
  )
}
