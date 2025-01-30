import { clsx, type ClassValue } from 'clsx'

import { format } from 'date-fns'

import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a JSON object to FormData.
 *
 * This function takes an object with key-value pairs and converts it into a FormData object.
 * It handles nested objects, arrays, and Blob instances appropriately.
 *
 * @param data - The JSON object to be converted to FormData. The object can contain nested objects, arrays, and Blob instances.
 * @returns A FormData object representing the input JSON object.
 *
 * @example
 * ```typescript
 * const data = {
 *   name: 'John Doe',
 *   age: 30,
 *   files: [new Blob(['file content'], { type: 'text/plain' })],
 *   address: {
 *     street: '123 Main St',
 *     city: 'Anytown'
 *   }
 * };
 * const formData = jsonToFormData(data);
 * ```
 */
export function jsonToFormData(data: {
  [key: string]: string | Blob | object
}): FormData {
  const formData = new FormData()

  Object.keys(data).forEach((key) => {
    const value = data[key]

    if (value === undefined || value === null) {
      // Skip undefined values
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(key, item)
        } else {
          formData.append(key, JSON.stringify(item))
        }
      })
    } else if (value instanceof Blob) {
      formData.append(key, value)
    } else if (typeof value === 'object') {
      // Handle nested objects
      for (const nestedKey in value) {
        if (Object.prototype.hasOwnProperty.call(value, nestedKey)) {
          //@ts-expect-error unspecified type
          const nestedValue = value[nestedKey]
          if (nestedValue === undefined) {
            // Skip undefined nested values
            continue
          }
          if (nestedValue instanceof Blob) {
            formData.append(`${key}[${nestedKey}]`, nestedValue)
          }
        }
      }
    } else {
      formData.append(key, value)
    }
  })

  return formData
}

export const toSnakeCase = (str: string) => {
  return str.toLowerCase().replace(/\s+/g, '_')
}

/**
 * Decode a base64-encoded string into an object of type T.
 * @param {string} encodedBuffer - The base64-encoded string to decode.
 * @returns {T} The decoded object of type T.
 * @throws {Error} Throws an error if decoding or parsing fails.
 */
export function decodeBuffer<T extends object>(encodedBuffer: string): T {
  try {
    const bufferdData = Buffer.from(encodedBuffer, 'base64')
    const decodedData = bufferdData.toString('utf-8')
    const parsedData = JSON.parse(decodedData)
    return parsedData as T
  } catch (error) {
    // Handle the error securely, e.g., log the error
    console.error('Error decoding buffer:', error)
    // You can choose to throw a custom error or return a default value here
    throw new Error('Failed to decode buffer')
  }
}

/**
 * Constructs a query string from the given `PaginationQuery` object.
 *
 * This function takes an optional `PaginationQuery` object and converts its
 * properties into URL search parameters. It filters out properties that are
 * `undefined`, `null`, empty strings, or have keys 'refetching' or 'queryArg'.
 * The resulting query string is prefixed with a '?'.
 *
 * @param data - An optional `PaginationQuery` object containing query parameters.
 * @returns A query string starting with '?' followed by the encoded parameters.
 */
export function queryFunction(data: Record<string, unknown> | undefined) {
  const searchParams = new URLSearchParams()
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        key !== 'refetching' &&
        key !== 'queryArg'
      ) {
        searchParams.append(key, value?.toString() ?? '')
      }
    })
  }
  return `?${searchParams.toString()}`
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {},
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`
}

/**
 * Returns the current date information based on the specified type.
 *
 * @param type - The type of date information to retrieve. Can be one of the following:
 *  - 'year': Returns the current year as a string.
 *  - 'date': Returns the current date of the month as a string.
 *  - 'month': Returns the current month (1-12) as a string.
 *  - 'week': Returns the current week of the month as a string.
 *  - 'day': Returns the current day of the week (0-6, where 0 is Sunday) as a string.
 * @returns The requested date information as a string.
 */
export function getCurrentDateInfo(
  type: 'year' | 'date' | 'month' | 'week' | 'day',
) {
  const currentDate = new Date()

  switch (type) {
    case 'year':
      return currentDate.getFullYear().toString()
    case 'date':
      return currentDate.getDate().toString()
    case 'month':
      return (currentDate.getMonth() + 1).toString() // Month is zero-based, so add 1
    case 'week':
      return Math.ceil(currentDate.getDate() / 7).toString() // Get the week of the month
    case 'day':
      return currentDate.getDay().toString() // Day of the week (0-6, 0 is Sunday)
    default:
      return ''
  }
}

export type NestedKeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`
}[keyof T & (string | number)]

/**
 * Retrieves the value at a given path within a nested object.
 *
 * @template T - The type of the object.
 * @param {T} obj - The object from which to retrieve the value.
 * @param {string} path - The dot-separated path string indicating the nested value to retrieve.
 * @returns {any} - The value at the specified path, or `undefined` if the path does not exist.
 *
 * @example
 * const obj = { a: { b: { c: 42 } } };
 * const value = getNestedValue(obj, 'a.b.c'); // 42
 * const missingValue = getNestedValue(obj, 'a.b.x'); // undefined
 */
export const getNestedValue = <T>(obj: T, path: string): unknown => {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && part in acc) {
      //@ts-expect-error can be any
      return acc[part]
    }
    return undefined
  }, obj)
}

export const sortComparer = <T>(
  a: T,
  b: T,
  field: NestedKeyOf<T> | keyof T,
  order: 'asc' | 'desc' = 'asc',
): number => {
  const valueA =
    typeof field === 'string' && field.includes('.')
      ? getNestedValue(a, field)
      : a[field as keyof T]
  const valueB =
    typeof field === 'string' && field.includes('.')
      ? getNestedValue(b, field)
      : b[field as keyof T]

  // Handle undefined or null values
  if (valueA == null && valueB == null) return 0
  if (valueA == null) return order === 'asc' ? -1 : 1
  if (valueB == null) return order === 'asc' ? 1 : -1

  // Compare dates
  if (valueA instanceof Date && valueB instanceof Date) {
    return order === 'asc'
      ? valueA.getTime() - valueB.getTime()
      : valueB.getTime() - valueA.getTime()
  }

  // Compare numbers
  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return order === 'asc' ? valueA - valueB : valueB - valueA
  }

  // Compare strings
  if (typeof valueA === 'string' && typeof valueB === 'string') {
    return order === 'asc'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA)
  }

  // For other types, convert to string and compare
  const stringA = String(valueA)
  const stringB = String(valueB)
  return order === 'asc'
    ? stringA.localeCompare(stringB)
    : stringB.localeCompare(stringA)
}
export const cleanAndGetFirst = (text: string | undefined) =>
  text?.replaceAll(/[^a-zA-Z0-9@.]/g, '')?.charAt(0) ?? 'N/A'

export const cleanSenderEmails = (email: string | undefined) =>
  email?.replaceAll('<', '(').replaceAll('>', ')')

export const getGreetingMessage = () => {
  const now = new Date()

  // Get the current hour in 24-hour format
  const currentHour = parseInt(format(now, 'H'))

  let greeting: 'Good Morning' | 'Good Afternoon' | 'Good Evening' | undefined

  if (currentHour < 12) {
    greeting = 'Good Morning'
  } else if (currentHour < 18) {
    greeting = 'Good Afternoon'
  } else {
    greeting = 'Good Evening'
  }

  return greeting
}

export const menuOptions = [
  'reply' as const,
  'move-archive' as const,
  'remove-archive' as const,
  'move-spam' as const,
  'remove-spam' as const,
  'draft' as const,
  'to-bin' as const,
  'remove-bin' as const,
  'ai-analyze' as const,
  'create-filter' as const,
  'delete' as const,
]
export const aiDropDown = [
  'create-filter' as const,
  // 'move-archive' as const,
  'move-spam' as const,
  'delete' as const,
]
export const getMenuOptions = (
  segment: string | undefined,
  context?: 'draft' | 'smart-ai',
): Partial<typeof menuOptions> => {
  if (context === 'smart-ai') {
    return aiDropDown
  }

  switch (segment) {
    case 'sent':
      return ['to-bin']
    case 'archived':
      return menuOptions.filter(
        (option) => option !== 'move-archive' && option !== 'remove-spam',
      )
    case 'spam':
      return menuOptions.filter(
        (option) =>
          option !== 'move-spam' &&
          option !== 'remove-archive' &&
          option !== 'move-archive' &&
          option !== 'ai-analyze',
      )
    case 'ai-analysed':
      return ['to-bin', 'reply', 'move-spam']
    case 'trash':
      return ['remove-bin', 'delete']
    default:
      return menuOptions.filter(
        (option) => option !== 'remove-archive' && option !== 'remove-spam',
      )
  }
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return null
}

/**
 * Inserts <wbr> tags into long words in a given text to allow for word breaking.
 *
 * @param text - The input text containing words to be processed.
 * @param maxLength - The maximum length of a word before <wbr> tags are inserted. Default is 20.
 * @param chunkSize - The size of chunks to split long words into by inserting <wbr> tags. Default is 5.
 * @returns The processed text with <wbr> tags inserted into long words.
 */
export function addWbrToLongWords(text: string, maxLength = 20, chunkSize = 5) {
  // Split the text by spaces or other delimiters
  return text
    .split(' ')
    .map((word) => {
      // If the word is longer than the maxLength, insert <wbr> tags
      if (word.length > maxLength) {
        return word.replace(new RegExp(`.{${chunkSize}}`, 'g'), '$&<wbr>')
      }
      // Return the word unchanged if it's not too long
      return word
    })
    .join(' ')
}

export const isObject = (data: unknown) =>
  Object.prototype.toString.call(data) === '[object Object]'

export function extractEmail(text: string) {
  const matcher = text?.match(/<([^>]+)>/)
  return matcher ? matcher[1] : (text ?? '')
}

export function pxToRem(px: number) {
  // Get the root element font size
  const rootFontSize = parseFloat(`16px`)
  // Convert pixels to rem
  return `${px / rootFontSize}rem`
}

export const debounce = (fn: () => void, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(fn, delay)
  }
}

type CaseType = 'camel' | 'snake' | 'pascal' | 'kebab' | 'title';

export const changeCase = (
  str: string,
  caseType: CaseType,
  replacer?: (value: string) => string,
): string => {
  // Apply replacer function if provided
  if (replacer) {
    str = replacer(str)
  }

  const words = str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Convert PascalCase/CamelCase to words
    .replace(/[_-]/g, ' ') // Convert snake_case and kebab-case to words
    .toLowerCase()
    .split(/\s+/)

  switch (caseType) {
    case 'camel':
      return words
        .map((word, index) => (index === 0 ? word : capitalize(word)))
        .join('')

    case 'snake':
      return words.join('_')

    case 'pascal':
      return words.map(capitalize).join('')

    case 'kebab':
      return words.join('-')
    case 'title': // Converts to Title Case (e.g., "Half Yearly")
      return words.map(capitalize).join(' ')
    default:
      return str
  }
}

// Helper function to capitalize the first letter
const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

