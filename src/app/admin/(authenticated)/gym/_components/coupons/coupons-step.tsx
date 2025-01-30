import CreateCouponDialog from '@/components/admin/dialogs/create-coupon'
import { Button } from '@/components/ui/button'
import { useStepper } from '@/components/ui/stepper'
import { Suspense } from 'react'
import CouponList from './coupons-list'
const GymCouponsStep = () => {
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
    <div className="flex flex-col gap-y-4">
      <div className={'flex items-center justify-between'}>
        <h2 className="px-2 text-xl font-semibold">Gym Coupons </h2>
        <Suspense>
          <CreateCouponDialog type="create" />
        </Suspense>
      </div>
      <Suspense>
        <CouponList />
      </Suspense>
      <div className="flex flex-col">{/* <PlanList /> */}</div>
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
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? 'Finish' : isOptionalStep ? 'Skip' : 'Next'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

//
// const BenefitsField: FC<{
//   index: number
// }> = ({index}) => {
//   const form = useFormContext<GymMemberShipsType>();
//
//   // This correctly initializes the field array for `benefits` (array of strings)
//   const {
//     fields,
//     append,
//     remove
//   } = useFieldArray<GymMemberShipsType>({
//     control: form.control,
//     name: `membershipPlans.${index}.benefits` as `membershipPlans.${number}.benefits`,
//   });
//   console.log(fields)
//   return (
//     <div>
//       <FormLabel>Benefits</FormLabel>
//       {fields.map((field, benefitIndex) => (
//         <div key={field.id} className="flex items-center gap-2 mb-2">
//           <FormControl>
//             <Input
//               placeholder="Enter a benefit"
//               {...form.register(`membershipPlans.${index}.benefits.${benefitIndex}` as const)}
//             />
//           </FormControl>
//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             onClick={() => remove(benefitIndex)}
//           >
//             <Trash2 className="h-4 w-4"/>
//           </Button>
//         </div>
//       ))}
//       <Button
//         type="button"
//         variant="outline"
//         size="sm"
//         onClick={() => append("")} // Appending a blank string as a new benefit
//       >
//         <PlusCircle className="h-4 w-4"/>
//         Add Benefit
//       </Button>
//     </div>
//   );
// };

export default GymCouponsStep
