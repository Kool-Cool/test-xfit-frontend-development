import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import * as React from 'react'

const linkVariants = cva(
  'text-primary  no-underline inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          ' !bg-primary !text-primary-foreground !hover:bg-primary/90 !hover:text-primary-foreground',
        destructive:
          '!bg-destructive !text-destructive-foreground !hover:bg-destructive/90 !hover:text-destructive-foreground/90',
        outline:
          '!bg-accent !text-accent-foreground !hover:bg-accent/90 !hover:text-accent-foreground',
        secondary:
          '!bg-secondary !text-secondary-foreground !hover:bg-secondary/90 !hover:text-secondary-foreground',
        ghost:
          '!bg-accent !text-accent-foreground !hover:bg-accent/90 !hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-4 py-2',
        xs: 'h-8 px-2 rounded-md', // added
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  prefetch?: boolean
  href: string
  asChild?: boolean
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, href, prefetch = true, ...props }, ref) => {
    return (
      <Link
        href={href}
        className={cn(linkVariants({ variant, className }))}
        ref={ref}
        prefetch={prefetch}
        {...props}
      />
    )
  },
)
LinkButton.displayName = 'LinkButton'

export { LinkButton, linkVariants }
