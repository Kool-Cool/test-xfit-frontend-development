import { CredentialsSignin } from 'next-auth'

export class CustomAuthError extends CredentialsSignin {
  code: string

  constructor(message: string, code: string, type: any) {
    super(message)
    this.code = code
    this.type = type
    Object.setPrototypeOf(this, new.target.prototype) // Restore prototype chain
  }

  static CredentialsSignin() {
    return new CustomAuthError(
      'Invalid Email or Password',
      'AUTH_ERROR',
      'CredentialsSignin',
    )
  }

  static UserNotFound() {
    return new CustomAuthError(
      'User not found',
      'USER_NOT_FOUND',
      'UserNotFound',
    )
  }

  static EmailNotVerified() {
    return new CustomAuthError(
      'Email not verified',
      'EMAIL_NOT_VERIFIED',
      'EmailNotVerified',
    )
  }

  static IncorrectPassword() {
    return new CustomAuthError(
      'Incorrect password',
      'INCORRECT_PASSWORD',
      'IncorrectPassword',
    )
  }

  static InternalServerError() {
    return new CustomAuthError(
      'Internal Server Error',
      'INTERNAL_SERVER_ERROR',
      'InternalServerError',
    )
  }

  static handleError(
    error: {
      error: string | undefined
      code: string | undefined
      status: number
      ok: boolean
      url: string | null
    },
    showToast: (message: string) => void,
  ) {
    switch (error.code) {
      case 'INCORRECT_PASSWORD':
        showToast('Invalid credentials. Please try again.')
        break
      case 'USER_NOT_FOUND':
        showToast('Your account does not exist, please register.')
        break
      case 'EMAIL_NOT_VERIFIED':
        showToast('Email not verified. Please verify your email.')
        break
      case 'INTERNAL_SERVER_ERROR':
        showToast('Internal server error. Please try again later.')
        break
      default:
        showToast('An unknown error occurred. Please try again.')
    }
  }
}
