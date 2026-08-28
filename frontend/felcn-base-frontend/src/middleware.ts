import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { imprimir } from '@/utils/imprimir'

// Decodifica el payload sin verificar firma (Edge-compatible). La firma la valida el backend.
const tokenVigente = (token: string | undefined): boolean => {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return typeof payload.exp === 'number' && Date.now() < payload.exp * 1000
  } catch {
    return false
  }
}

// Rutas accesibles sin sesión iniciada. Todo lo demás requiere token vigente.
const RUTAS_PUBLICAS = [
  '/login',
  '/login/ciudadania',
  '/registro',
  '/pre-registro',
  '/recuperacion',
  '/activacion',
  '/desbloqueo',
]

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get('token')
  const valido = tokenVigente(token?.value)
  // next.config.js usa trailingSlash: true, así que las rutas canónicas llegan como '/login/', '/admin/home/', etc.
  // Se normaliza quitando la barra final para que las comparaciones exactas ('/login') sigan funcionando.
  const pathname =
    req.nextUrl.pathname.length > 1
      ? req.nextUrl.pathname.replace(/\/$/, '')
      : req.nextUrl.pathname
  imprimir(`token middleware 🔐️: ${token?.value ? (valido ? 'vigente' : 'expirado') : 'ausente'}`, pathname)

  try {
    if (pathname == '/') {
      const url = req.nextUrl.clone()
      url.pathname = valido ? '/admin/home' : '/login'
      return NextResponse.redirect(url)
    }

    if (pathname == '/login') {
      if (valido) {
        const url = req.nextUrl.clone()
        url.pathname = '/admin/home'
        return NextResponse.redirect(url)
      }
      return NextResponse.next()
    }

    if (RUTAS_PUBLICAS.includes(pathname)) {
      return NextResponse.next()
    }

    // Cualquier otra ruta de la aplicación (admin, operativos, seguimientos,
    // reportes, análisis, patrimonio, investigaciones, lgi, etc.) requiere
    // sesión vigente — antes solo se protegía /admin/:path*, dejando el
    // resto de la app servida del lado del servidor sin verificar sesión.
    if (valido) {
      return NextResponse.next()
    }

    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  } catch (e) {
    imprimir(`Error verificando token en middleware`, e)
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}

// Se protege TODA la aplicación por defecto — se excluyen los internals de
// Next.js y cualquier archivo estático servido desde /public (imágenes,
// íconos de Leaflet, locales, fuentes, etc. — necesarios incluso en /login,
// que no tiene sesión). Las rutas públicas de negocio se filtran arriba, en
// RUTAS_PUBLICAS, para que queden auditables en un solo lugar.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|woff2?|ttf|json)$).*)',
  ],
}
