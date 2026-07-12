import { decodeToken } from 'react-jwt'
import { imprimir } from '@/utils/imprimir'

export const verificarToken = (token: string): boolean => {
  if (!token) return false
  const myDecodedToken: any = decodeToken(token)
  if (!myDecodedToken?.exp) return false

  const caducidad = new Date(myDecodedToken.exp * 1000)

  imprimir(`Token 🔐 : expira en ${caducidad}`)

  return new Date().getTime() - caducidad.getTime() < 0
}

/** Retorna los milisegundos restantes hasta que el token expire. 0 si ya expiró o es inválido. */
export const tiempoHastaExpirar = (token: string): number => {
  if (!token) return 0
  try {
    const payload: any = decodeToken(token)
    if (typeof payload?.exp !== 'number') return 0
    return Math.max(0, payload.exp * 1000 - Date.now())
  } catch {
    return 0
  }
}
