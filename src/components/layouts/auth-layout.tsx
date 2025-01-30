'use client'
import { useSession } from 'next-auth/react'
import { type ReactNode, type FC, useEffect } from 'react'

const AuthWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession()
  useEffect(() => {
    if (status !== 'loading' && status === 'authenticated' && session?.token) {
      localStorage.setItem('access_token', session.token)
    } else if (status !== 'loading') {
      localStorage.removeItem('access_token')
    }
  }, [status])
  return children
}

export default AuthWrapper
