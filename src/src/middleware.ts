import { NextRequest, NextResponse } from 'next/server'

export type Locale = 'th' | 'en' | 'lo'

const locales: Locale[] = ['th', 'en', 'lo']
const defaultLocale: Locale = 'en'

// Function to check if the path is a static asset
function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    (pathname.includes('.') && !pathname.endsWith('/')) ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml')
  )
}

function getLocale(request: NextRequest): Locale {
  // 1. ตรวจสอบ URL path
  const pathname = request.nextUrl.pathname
  const pathSegments = pathname.split('/').filter(Boolean)

  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0]
    if (locales.includes(firstSegment as Locale)) {
      return firstSegment as Locale
    }
  }

  // 2. ตรวจสอบ domain/subdomain
  const hostname = request.nextUrl.hostname
  if (hostname.includes('.th.')) return 'th'
  if (hostname.includes('.lo.')) return 'lo'
  if (hostname.includes('.en.') || hostname.includes('.com')) return 'en'

  const subdomain = hostname.split('.')[0]
  if (subdomain === 'th') return 'th'
  if (subdomain === 'lo') return 'lo'
  if (subdomain === 'en') return 'en'

  // 3. ใช้ค่าเริ่มต้นเมื่อไม่มี locale ใน URL path
  // ไม่ตรวจสอบ Accept-Language เพื่อป้องกันการ auto-switch

  // 4. ค่าเริ่มต้น
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static assets
  if (isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  // ตรวจสอบว่า pathname มีภาษาอยู่แล้วหรือไม่
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  // รับภาษาปัจจุบัน
  const locale = getLocale(request)

  // Redirect หากไม่มีภาษาใน pathname และไม่ใช่ root path
  if (!pathnameHasLocale && pathname !== '/') {
    const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // ถ้าเป็น root path และไม่มี locale ให้ redirect ไปยังภาษาเริ่มต้น
  if (pathname === '/') {
    const redirectUrl = new URL(`/${locale}`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Auth routes (หน้าสาธารณะที่ควร redirect ไป dashboard หากล็อกอินแล้ว)
  const authRoutes = ['/sign-in', '/sign-up', '/verify']
  const isAuthRoute = authRoutes.some((route) => {
    if (pathnameHasLocale) {
      // ตรวจสอบ path หลังจากภาษา เช่น /th/sign-in -> /sign-in
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
      return pathWithoutLocale.startsWith(route)
    }
    return pathname.startsWith(route)
  })

  // Protected routes ที่ต้องการการยืนยันตัวตน
  const protectedRoutes = ['/dashboard', '/team', '/back-office']
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (pathnameHasLocale) {
      // ตรวจสอบ path หลังจากภาษา เช่น /th/dashboard -> /dashboard
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
      return pathWithoutLocale.startsWith(route)
    }
    return pathname.startsWith(route)
  })

  // รับ tokens จาก cookies
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // ตรวจสอบว่า user มี tokens หรือไม่
  const hasTokens = !!(accessToken && refreshToken)

  // หากพยายามเข้าถึงหน้า auth ขณะที่ล็อกอินอยู่ ให้ redirect ไป dashboard
  if (isAuthRoute && hasTokens) {
    const dashboardUrl = pathnameHasLocale
      ? `/${pathname.split('/')[1]}/dashboard`
      : `/${locale}/dashboard`
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }

  // หากพยายามเข้าถึง protected routes โดยไม่มี token ให้ redirect ไป sign-in
  if (isProtectedRoute && !hasTokens) {
    const signInUrl = pathnameHasLocale
      ? `/${pathname.split('/')[1]}/sign-in`
      : `/${locale}/sign-in`
    const response = NextResponse.redirect(new URL(signInUrl, request.url))

    // เก็บ URL ปัจจุบันไว้สำหรับ redirect กลับหลัง login
    const currentPath = pathname + request.nextUrl.search
    if (currentPath !== '/sign-in' && !currentPath.includes('/sign-')) {
      response.cookies.set('redirectAfterLogin', currentPath, {
        maxAge: 60 * 15, // 15 minutes
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }

    return response
  }

  // สำหรับกรณีอื่นๆ ให้ดำเนินการต่อไปตามปกติ
  // การตรวจสอบและรีเฟรช Token จะถูกจัดการโดยโค้ดฝั่ง client
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
