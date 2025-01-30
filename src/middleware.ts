import {auth} from '@/auth'
import {NextResponse} from 'next/server'

const UNAUTHENTICATED_PATHS = [
  /\/auth\/.*/,
  /\/admin\/auth/,
  /^\/$/,
  /^\/about-us$/,
  /\/api\/get-token/,
  /^\/driver\/jobs$/,
]
const COMMON_PATHS = [/\/chats(\/.*)?/, /\/profile\/.*/, /^\/$/, /^\/about-us$/]
const matchesPath = (path: string, patterns: RegExp[]) =>
  patterns.some((pattern) => pattern.test(path))

export default auth(async (req) => {
  const session = req.auth
  console.debug(
    'User Name: ',
    session?.user.name,
    'User Role: ',
    session?.user.userType,
  )
  const pathname = req.nextUrl.pathname
  console.log('Requested Path: ',req.method, pathname)

  const userType = session?.user?.userType

  if (!session && !matchesPath(pathname, UNAUTHENTICATED_PATHS)) {
    const newUrl = new URL('/admin/auth', req.nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }

  if (session && matchesPath(pathname, COMMON_PATHS)) {
    console.log('Common path requested')
    return NextResponse.next({
      request: {
        ...req,
      },
    })
  }
  if (
    session &&
    session.user &&
    userType === 'ADMIN' &&
    (!pathname.startsWith('/admin') || pathname.startsWith('/admin/auth'))
  ) {
    const newUrl = new URL('/admin', req.nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }
  // if (
  //   session &&
  //   session.user &&
  //   userType === 'CUSTOMER' &&
  //   !pathname.startsWith('/business')
  //   // !pathname.startsWith('/chats')
  // ) {
  //   const newUrl = new URL('/business/my-jobs', req.nextUrl.origin);
  //   return NextResponse.redirect(newUrl);
  // }
  NextResponse.next({
    request: {
      ...req,
    },
  })
})
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!api|v0|_next|uploads|__nextjs_original-stack-frame|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(trpc)(.*)',
  ],
}
