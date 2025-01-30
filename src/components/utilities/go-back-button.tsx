'use client'

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation"

interface ButtonProps {
  content?: string
  className?: string
}

export default function GoBackButton({content, className}: ButtonProps) {
  const {back} = useRouter()
  return <Button onClick={back} className={cn('', className)}>
    {content ?? (<>
      <div className="flex text-sm gap-x-2 items-center">
        <ArrowLeft/>
        <span>
        Go Back
      </span>
      </div>
    </>)}
  </Button>
}