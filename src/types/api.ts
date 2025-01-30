import type { UserI } from '@/types'

export interface LoginResponse {
  message: string
  user: UserI
  token: string // JWT token
  status: boolean
  error: string | null
  status_code: number
}

export type UploadedFileResponse = {
  uploadedFile: {
    publicId: string
    url: string
    type: 'jpg' | 'png' // Constrain to specific file types
  }
  status: boolean
  message: string
}
