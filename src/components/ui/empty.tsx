import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'
const defaultEmptyImg = (
  <Inbox className="size-20 text-gray-400" strokeWidth={'1'} />
)
const simpleEmptyImg = (
  <Inbox className="size-20 text-gray-400" strokeWidth={'1'} />
)

export interface TransferLocale {
  description: string
}

export interface EmptyProps {
  prefixCls?: string
  className?: string
  rootClassName?: string
  style?: React.CSSProperties
  /** @since 3.16.0 */
  imageStyle?: React.CSSProperties
  image?: React.ReactNode
  altImage?: string
  description?: React.ReactNode
  children?: React.ReactNode
}

type CompoundedComponent = React.FC<EmptyProps> & {
  PRESENTED_IMAGE_DEFAULT: React.ReactNode
  PRESENTED_IMAGE_SIMPLE: React.ReactNode
}

const Empty: CompoundedComponent = ({
  className,
  rootClassName,
  prefixCls: customizePrefixCls,
  altImage,
  image = defaultEmptyImg,
  description,
  children,
  imageStyle,
  style,
  ...restProps
}) => {
  const prefixCls = customizePrefixCls || 'empty'

  const des =
    description ||
    "Sorry, there's nothing here at the moment. Please check back later or add some new items."

  let imageNode: React.ReactNode = null

  if (typeof image === 'string') {
    imageNode = <Image alt={altImage ?? 'Empty'} src={image} />
  } else {
    imageNode = image
  }

  return (
    <div
      className={cn(
        `${prefixCls}`,
        className,
        rootClassName,
        'flex w-full flex-col items-center justify-center p-4',
      )}
      style={style}
      {...restProps}>
      <div className="mb-4" style={imageStyle}>
        {imageNode}
      </div>
      {des && <div className="max-w-md text-center text-sm">{des}</div>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

Empty.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg
Empty.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg

if (process.env.NODE_ENV !== 'production') {
  Empty.displayName = 'Empty'
}

export default Empty
