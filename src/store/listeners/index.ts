// import { toast } from '@/components/ui/use-toast'
import { signOut } from '@/app/actions/auth.action'
import { isRejectedWithValue } from '@reduxjs/toolkit/react'

import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit/react'
import { toast } from 'sonner'

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => async (action) => {
    if (!action) return
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      const errorMessage =
        'data' in action.error
          ? (action.error.data as { message: string }).message
          : action.error.message
      console.warn('We got a rejected action', { errorMessage, action })
      toast.dismiss()
      if (
        action.payload &&
        //@ts-ignore
        action.payload?.status &&
        //@ts-ignore
        action?.payload?.status === 401
      ) {
        await signOut()
      }
      if (
        action.payload &&
        //@ts-ignore
        action.payload?.status &&
        //@ts-ignore
        action?.payload?.status === 'FETCH_ERROR'
      ) {
        toast.error("Couldn't connect to server.")
      }

      // toast({
      //   variant: 'destructive',
      //   title: 'Async error!',
      //   description:
      //     e,
      // })
      // toast.warn({
      //   title: 'Async error!',
      //   message:
      //     'data' in action.error
      //       ? (action.error.data as { message: string }).message
      //       : action.error.message,
      // })
    }

    return next(action)
  }

export const initialMiddleware: Middleware =
  (store: MiddlewareAPI) => (next) => async (action) => {
    return next(action)
  }
