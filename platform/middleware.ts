import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_NAME, verifySessionToken, getRoleRedirect } from '@/lib/auth/session'
import { SITE } from '@/config/site'

const PUBLIC_PATHS = [
  '/',
  '/servicios',
  '/apps',
  '/precios',
  '/portafolio',
  '/nosotros',
  '/afiliados',
  '/contacto',
  '/demo',
  '/demo/gracias',
  '/registro',
  '/iniciar-sesion',
  '/recuperar-contrasena',
  '/blog',
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function getTenantSlug(host: string): string | null {
  const appsDomain = SITE.appsDomain
  if (!host.endsWith(`.${appsDomain}`)) return null
  const slug = host.replace(`.${appsDomain}`, '').split(':')[0]
  if (!slug || slug === 'www') return null
  return slug
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''

  // Multi-tenant: slug.wboost.app → /tenant/[slug]
  const tenantSlug = getTenantSlug(host)
  if (tenantSlug && !pathname.startsWith('/api') && !pathname.startsWith('/tenant')) {
    const url = request.nextUrl.clone()
    url.pathname = `/tenant/${tenantSlug}${pathname === '/' ? '' : pathname}`
    return NextResponse.rewrite(url)
  }

  const token = request.cookies.get(COOKIE_NAME)?.value
  const session = token ? await verifySessionToken(token) : null

  // Auth pages: redirect if logged in
  if (session && (pathname === '/registro' || pathname === '/iniciar-sesion')) {
    return NextResponse.redirect(new URL(getRoleRedirect(session.role), request.url))
  }

  // Protected routes
  const isDashboard = pathname.startsWith('/dashboard')
  const isAdmin = pathname.startsWith('/admin')
  const isAffiliate = pathname.startsWith('/afiliado')

  if (isDashboard || isAdmin || isAffiliate) {
    if (!session) {
      const login = new URL('/iniciar-sesion', request.url)
      login.searchParams.set('from', pathname)
      return NextResponse.redirect(login)
    }
    if (isAdmin && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (isAffiliate && session.role !== 'affiliate' && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Allow public + API
  if (isPublicPath(pathname) || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
