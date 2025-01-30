import {isObject} from '@/lib/utils'
import {
  type BaseQueryApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

console.log(process.env.NEXT_PUBLIC_API_ENV)

const isPreview = process.env.NEXT_PUBLIC_API_ENV === 'preview'

const urlBase = process.env.NEXT_PUBLIC_API_URL

if (isPreview && !urlBase) {
  throw Error(
    'NEXT_PUBLIC_API_URL and API_URL needed in environment file if API_ENV=`preview`',
  )
}

// if NEXT_PUBLIC_API_ENV && API_ENV is "production", use /_api else request from https://app.smartinbox.ai/_api/
// Change the prefix if needed
export const url = !!(isPreview && urlBase)
  ? '/v0'
  : urlBase
    ? `${urlBase}/v0`
    : '/v0'

console.debug('ℹ️ ~ file: rtk-utils.ts:10 ~ url:', url)
type SSEBaseQueryParams = {
  url: string
}

type SSEBaseQueryResponse<T> = {
  data: T
}

export const baseQuery =
  (baseUrl?: string) =>
  async (
    args: string | FetchArgs, // Expect `args` to include `url` if it’s an object
    api: BaseQueryApi,
    extraOptions: { signal?: AbortSignal } = {},
  ) => {
    const { signal } = extraOptions || {}
    const baseQueryArgs = isObject(args)
      ? { ...(args as FetchArgs), signal }
      : args
    return fetchBaseQuery({
      baseUrl: baseUrl ?? url,
      credentials: 'include',
      //TODO - Comment this if using cookies for authorization
      prepareHeaders: async (headers) => {
      const sessionToken = sessionStorage.getItem('access_token')
      const localToken = localStorage.getItem('access_token')
      if (localToken || sessionToken) {
        headers.set('Authorization', `Bearer ${sessionToken ?? localToken}`)
      }
        return headers;
      },
    })(baseQueryArgs, api, extraOptions)
  }

export const sseBaseQuery = async <T>(
  { url }: SSEBaseQueryParams,
  { signal }: { signal: AbortSignal },
): Promise<SSEBaseQueryResponse<T>> => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const data: T = JSON.parse(event.data)
        resolve({ data })
      } catch (error) {
        reject(error)
      }
    }

    eventSource.onerror = (error) => {
      eventSource.close()
      reject(error)
    }

    signal.addEventListener('abort', () => {
      eventSource.close()
    })
  })
}

export const transformErrorResponse = (
  response: FetchBaseQueryError,
  // meta: FetchBaseQueryMeta | undefined,
  // args: unknown
): string => {
  if (
    'data' in response &&
    typeof response.data === 'object' &&
    response.data !== null
  ) {
    const data = response.data as Record<string, unknown>

    // Handle detailed errors
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((err) => {
          // Format the error message
          // const field = err.loc ? err.loc[1] : 'Unknown field';
          const message = err.msg || 'Invalid input'
          return `${message}`
        })
        .join(', ')
    }
    if ('detail' in data) {
      return data.detail as string
    }
    // Fallback for a single message
    if ('message' in data) {
      return data.message as string
    }
  }

  return 'Something went wrong'
}
