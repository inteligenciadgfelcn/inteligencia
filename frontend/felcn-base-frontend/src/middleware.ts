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
      if (valido) {
        const url = req.nextUrl.clone()
        url.pathname = '/admin/home'
        return NextResponse.redirect(url)
      } else {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
    }

    if (pathname == '/login') {
      if (valido) {
        const url = req.nextUrl.clone()
        url.pathname = '/admin/home'
        return NextResponse.redirect(url)
      } else {
        return NextResponse.next()
      }
    }

    if (pathname.startsWith('/admin')) {
      if (valido) {
        return NextResponse.next()
      } else {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  } catch (e) {
    imprimir(`Error verificando token en middleware`, e)
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}

// next.config.js usa trailingSlash: true, por lo que '/login' se sirve como '/login/'.
// Se incluyen ambas formas para que el middleware se invoque también en la ruta canónica.
export const config = {
  matcher: ['/', '/login', '/login/', '/admin/:path*'],
}
