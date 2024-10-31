import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside

const protectedRoutes = ['/me'];
const authRoutes = ['/login', '/register'];
export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('sessionToken')?.value;
  if(protectedRoutes.includes(request.nextUrl.pathname) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if(authRoutes.includes(request.nextUrl.pathname) && sessionToken) {
    return NextResponse.redirect(new URL('/me', request.url))
  }
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/me',
    '/login',
    '/register'
  ],
}