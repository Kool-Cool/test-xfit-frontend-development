'use server'
import { signIn as nextSignIn, signOut as nextSignOut } from '@/auth'
import type { UserRole } from '@/types'
export const signIn = async ({
  data,
  userType,
}: {
  data: { email: string; password: string; remember?: boolean | undefined }
  userType: UserRole
}) =>
  await nextSignIn('credentials', {
    email: data.email,
    password: data.password,
    user_type: userType,
    remember: data.remember,
    redirect: false,
    callbackUrl: '/',
  })

export const signOut = async (
  options?: { redirectTo?: string; redirect?: true | undefined } | undefined,
) => await nextSignOut(options)
