'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
    // Simulate sending error to a reporting service
    reportError(error)
  }, [error])

  const reportError = async (error: Error) => {
    // This is a placeholder for actual error reporting logic
    console.log('Reporting error:', error.message)
    // In a real scenario, you would send this to your error tracking service
    // await fetch('/api/report-error', { method: 'POST', body: JSON.stringify(error) })
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Our team has been notified and is working to resolve the issue.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-md bg-gray-100 p-4">
              <p className="font-mono text-sm text-gray-700">{error.message}</p>
              {error.digest && (
                <p className="mt-2 font-mono text-xs text-gray-500">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => reset()}>Try Again</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
