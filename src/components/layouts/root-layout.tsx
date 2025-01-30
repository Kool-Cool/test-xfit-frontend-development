import StoreProvider from '@/store/provider'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { SessionProvider } from 'next-auth/react'
import AuthWrapper from '@/components/layouts/auth-layout'
const RootLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <StoreProvider>
        <>
          <AuthWrapper>{children}</AuthWrapper>
          <Toaster
            position="bottom-right"
            visibleToasts={6}
            duration={2000}
            toastOptions={{
              classNames: {
                toast: '', // toast: 'bg-primary',
                actionButton: 'bg-zinc-400',
                cancelButton: 'bg-orange-400',

                closeButton: 'bg-lime-400',
                error: 'bg-destructive text-destructive-foreground',
                success: 'bg-green-500 text-primary-foreground',
              },
            }}
          />
        </>
      </StoreProvider>
    </SessionProvider>
  )
}

export default RootLayout
