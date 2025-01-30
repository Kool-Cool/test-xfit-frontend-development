import type { UserI } from '@/types/index'
import { DefaultJWT } from '@auth/core/jwt'

declare module 'next-auth' {
  interface Session {
    user: UserI
    token: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    picture: undefined
    user: UserI
  }
}
