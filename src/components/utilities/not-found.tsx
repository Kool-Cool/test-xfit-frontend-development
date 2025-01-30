import {Button} from "@/components/ui/button"
import GoBackButton from "@/components/utilities/go-back-button";
import {Ghost, Home} from "lucide-react"
import Link from "next/link"

export default function NotFoundComponent() {
  return (
    <main
      className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-6 px-4 py-16 md:px-8 md:py-24 lg:gap-10">
      <div className="relative">
        <div
          className="absolute -left-1 -top-1 size-40 animate-pulse rounded-full bg-primary/50 blur-xl dark:bg-primary/20"/>
        <div className="relative flex size-40 items-center justify-center rounded-2xl border bg-background shadow-sm">
          <Ghost className="size-20 animate-hover text-muted-foreground"/>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>
      <div className="flex items-center gap-x-2">

        <GoBackButton/>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 size-4"/>
            Go back home
          </Link>
        </Button>
      </div>
    </main>
  )
}

