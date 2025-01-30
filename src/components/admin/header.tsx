import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export default function HeaderDetails({
  children,
  className,
  wrapperClassName,
}: {
  children: ReactNode
  className?: string
  wrapperClassName?: string
}) {
  return (
    <div
      className={cn(
        'sticky top-0 z-50 rounded-t-xl bg-white',
        wrapperClassName,
      )}>
      <div
        className={cn(
          'flex min-h-16 w-full items-center gap-x-1 px-2 py-1 md:gap-x-2',
          className,
        )}>
        <SidebarTrigger className={'size-5 md:hidden md:size-6'} />
        {children}
      </div>
      <Separator />
    </div>
  )
}
