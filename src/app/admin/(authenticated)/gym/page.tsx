import GymList from '@/components/admin/gym-list'
import HeaderDetails from '@/components/admin/header'
import {Suspense} from 'react'
import {LinkButton} from '@/components/ui/link-button'
import {Plus} from 'lucide-react'

const GymDashboard = () => {
  return (
    <div className="w-full">
      <HeaderDetails wrapperClassName={'bg-none'}>
        <div className="flex w-full items-center justify-between px-2">
          <div className="flex w-full flex-col items-start px-2">
            <h2 className="text-lg font-semibold text-gray-700 md:text-xl">Gym Dashboard</h2>
            <p className="text-xs sr-only md:not-sr-only md:text-sm text-gray-400">
              Manage gym details here.
            </p>
          </div>
        </div>
      </HeaderDetails>
      <div className="flex flex-col gap-y-4 my-3 md:m-4">
        {/*<section id="gyms-list" className={'flex flex-col gap-y-3'}>*/}
        {/*  <h3 className="font-semibold text-xl md:text-2xl px-2 md:pl-3">Gym List</h3>*/}
        {/*</section>*/}
        <section id="gyms-list" className={'flex flex-col gap-y-3'}>
          <div className="flex px-2 md:pl-3 pb-2 md:pb-4 items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-600 md:text-2xl">
              Gym List
            </h3>

            <LinkButton
              href={'/admin/gym/add'}
              size={'default'}
              className={
                'inline-flex items-center rounded-full gap-x-1 text-nowrap p-0 text-xs size-fit px-2 py-1 md:px-4 md:py-2 '
              }
              variant={'default'}>
              <Plus strokeWidth={'2px'} className={'size-5'} />{' '}
              <span
                className={
                  ' text-nowrap text-xs font-semibold'
                }>
                Add Gym
              </span>
            </LinkButton>
          </div>
          <div className="px-4">
            <Suspense>
              <GymList />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GymDashboard
