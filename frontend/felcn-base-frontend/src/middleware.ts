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
  imprimir(`token middleware 🔐️: ${token?.value ? (valido ? 'vigente' : 'expirado') : 'ausente'}`, req.nextUrl.pathname)

  try {
    if (req.nextUrl.pathname == '/') {
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

    if (req.nextUrl.pathname == '/login') {
      if (valido) {
        const url = req.nextUrl.clone()
        url.pathname = '/admin/home'
        return NextResponse.redirect(url)
      } else {
        return NextResponse.next()
      }
    }

    if (req.nextUrl.pathname.startsWith('/admin')) {
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

// Supports both a single string value or an array of matchers.
export const config = {
  matcher: ['/', '/login', '/admin/:path*'],
}
