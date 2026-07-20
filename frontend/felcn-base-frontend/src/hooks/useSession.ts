import { delay, eliminarCookie, guardarCookie, leerCookie } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { estadosSinPermiso, peticionFormatoMetodo, Servicios } from '@/services'
import { verificarToken } from '@/utils/token'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { Constantes } from '@/config/Constantes'

// Flag a nivel de módulo: evita múltiples cerrarSesion simultáneos
let sesionCerrando = false

export const useSession = () => {
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const sesionPeticion = async <T = any>({
    url,
    method = 'get',
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormatoMetodo): Promise<T> => {
    if (!verificarToken(leerCookie('token') ?? '')) {
      imprimir(`Token caducado ⏳`)
      const renovado = await actualizarSesion()
      if (!renovado) {
        // actualizarSesion ya cerró la sesión y redirigió a /login: no continuar con la petición
        throw new Error('Sesión finalizada: no se pudo renovar el token')
      }
    }

    try {
      const cabeceras = {
        accept: 'application/json',
        Authorization: `Bearer ${leerCookie('token') ?? ''}`,
        ...headers,
      }

      imprimir(`enviando 🔐🌍`, body, method, url, cabeceras)
      const response = await Servicios.peticionHTTP<T>({
        url,
        method: method,
        headers: cabeceras,
        body,
        params,
        responseType,
        withCredentials,
      })
      imprimir('respuesta 🔐📡', body, method, url, response)
      return response.data
    } catch (e: import('axios').AxiosError | any) {
      if (e.code === 'ECONNABORTED') {
        throw new Error('La petición está tardando demasiado')
      }

      if (Servicios.isNetworkError(e)) {
        throw new Error('Error en la conexión 🌎')
      }

      if (estadosSinPermiso.includes(e.response?.status)) {
        mostrarFullScreen()
        await cerrarSesion()
        ocultarFullScreen()
        // No continuar como si la petición hubiera tenido éxito: la sesión ya se cerró
        throw e.response?.data || new Error('Sesión finalizada')
      }

      throw e.response?.data || 'Ocurrió un error desconocido'
    }
  }

  const borrarCookiesSesion = () => {
    eliminarCookie('token')
    // jid es httpOnly — solo el backend puede eliminarlo vía Set-Cookie
  }

  const cerrarSesion = async () => {
    if (sesionCerrando) return
    sesionCerrando = true
    try {
      mostrarFullScreen()
      await delay(1000)
      const token = leerCookie('token')
      borrarCookiesSesion()

      const respuesta = await Servicios.get({
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        url: `${Constantes.authUrl}/logout`,
      })
      imprimir(`finalizando con respuesta`, respuesta)

      if (respuesta?.url) {
        window.location.href = respuesta?.url
      } else {
        window.location.href = Constantes.loginPath
      }
    } catch (e) {
      imprimir(`Error al cerrar sesión: `, e)
      window.location.href = Constantes.loginPath
    } finally {
      sesionCerrando = false
      ocultarFullScreen()
    }
  }

  /** Intenta renovar el token. Devuelve false si falló (en cuyo caso ya cerró la sesión). */
  const actualizarSesion = async (): Promise<boolean> => {
    imprimir(`Actualizando token 🚨`)

    try {
      const respuesta = await Servicios.post({
        url: `${Constantes.authUrl}/token`,
        body: {
          token: leerCookie('token'),
        },
      })

      guardarCookie('token', respuesta.datos?.access_token)

      await delay(500)
      return true
    } catch (e) {
      await cerrarSesion()
      return false
    }
  }

  return { sesionPeticion, cerrarSesion, borrarCookiesSesion, actualizarSesion }
}
