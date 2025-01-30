'use client'

import { Button } from '@/components/ui/button'
import { useStepper } from '@/components/ui/stepper'
import { Suspense } from 'react'
import { GymVisualsList } from './visuals/visuals-list'
import type { TagsType } from '@/lib/zod-schemas/gym-visuals.schema'

const gymVisualsData: {
  listName?: string
  tag: TagsType
  maxMediaLength?: number
  onHover: {
    listDesc: string
    listItems: string[]
  }
}[] = [
  {
    listName: 'Reception and Welcome Area',
    tag: 'RECEPTION',
    maxMediaLength: 1,
    onHover: {
      listDesc:
        'Add up to 1 picture of the reception area. Make sure the check-in desk and other elements are clearly visible.',
      listItems: [
        'Check-in desk',
        'Waiting area - OPTIONAL',
        'Retail display (e.g., gym merchandise, supplements) - OPTIONAL',
        'Lockers for small valuables',
      ],
    },
  },
  {
    listName: 'Cardio Zone',
    tag: 'CARDIO',
    maxMediaLength: 2,
    onHover: {
      listDesc:
        'Add up to 2 pictures of the cardio zone. Make sure all the machines are clearly visible.',
      listItems: [
        'Treadmills',
        'Elliptical trainers',
        'Stationary bikes (upright and recumbent)',
        'Rowing machines',
        'Stair climbers',
      ],
    },
  },
  {
    listName: 'Strength Training Zone',
    tag: 'STRENGTH',
    maxMediaLength: 6,
    onHover: {
      listDesc:
        'Add up to 6 pictures of the strength training area. Ensure free weights and machines are visible.',
      listItems: [
        'Free weights (dumbbells, barbells, kettlebells)',
        'Weight machines (cable systems, leg press, chest press, etc.)',
        'Squat racks and power cages',
        'Benches (flat, incline, and decline)',
      ],
    },
  },
  {
    listName: 'Group Fitness Studio',
    tag: 'GROUPFITNESS',
    maxMediaLength: 2,
    onHover: {
      listDesc:
        'Add up to 2 pictures of the group fitness studio. Ensure space and equipment are clearly visible.',
      listItems: [
        'Space for yoga, Zumba, spin classes, etc.',
        'Mirrors and sound system',
        'Storage for mats, steps, and other equipment',
      ],
    },
  },
  {
    listName: 'Locker Rooms and Changing Areas',
    tag: 'LOCKERROOM',
    maxMediaLength: 2,
    onHover: {
      listDesc:
        'Add up to 2 pictures of the locker rooms and changing areas. Show lockers, showers, and vanity spaces.',
      listItems: [
        'Lockers',
        'Showers',
        'Restrooms',
        'Vanity area (mirrors, hairdryers)',
      ],
    },
  },
  {
    listName: 'Recovery and Wellness Area',
    tag: 'RECOVERY',
    maxMediaLength: 2,
    onHover: {
      listDesc:
        'Add up to 2 pictures of the recovery and wellness area. Ensure relaxation features are visible.',
      listItems: [
        'Massage chairs or tables',
        'Cryotherapy or sauna (optional)',
        'Relaxation lounges',
      ],
    },
  },
  {
    listName: 'Functional Training Area',
    tag: 'FUNCTIONAL',
    maxMediaLength: 2,
    onHover: {
      listDesc:
        'Add up to 2 pictures of the functional training area. Show open space and equipment.',
      listItems: [
        'Open space for bodyweight exercises',
        'Medicine balls',
        'Battle ropes',
        'Plyometric boxes',
        'Suspension trainers (e.g., TRX)',
        'CrossFit Zone: Rig, bars, bumper plates, climbing ropes',
        'Boxing/Martial Arts: Punching bags, gloves, speed bags',
        'HIIT Area: High-impact mats, sleds, etc.',
      ],
    },
  },
  {
    listName: 'Others',
    tag: 'AMENITIESS',
    maxMediaLength: 2,
    onHover: {
      listDesc: 'Add up to 2 pictures of any other amenities.',
      listItems: ['Capture and upload additional amenities not listed.'],
    },
  },
]

export default function GymVisualsStep() {
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
        <h2 className="px-2 text-xl font-semibold">Media & Visuals </h2>
        {/*<Suspense>*/}
        {/*  <AddGymMedia/>*/}
        {/*</Suspense>*/}
      </div>
      <div className={'flex flex-col items-center justify-between gap-y-4'}>
        <Suspense>
          {/*<GymVisualsList/>*/}
          {gymVisualsData.map((item, index) => (
            <GymVisualsList
              key={index}
              listName={item.listName}
              tag={item.tag}
              onHover={item.onHover}
              maxMediaLength={item.maxMediaLength}
            />
          ))}
        </Suspense>
      </div>
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
// const GymVisualsList = () => {
//   const searchParams = useSearchParams()
//   const gymId = searchParams.get("gym_id")
//   const {data} = useGetGymByIdQuery(gymId ?? '', {
//     skip: !gymId,
//     selectFromResult: ({data, ...otherArgs}) => {
//       return {data: data?.gym.medias, ...otherArgs}
//     }
//   })
//   return (
//     <div>
//       {data?.map((media) => <GymVisualItem key={media.id}/>)}
//     </div>
//   )
// }
