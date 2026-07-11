import { peticionFormatoMetodo, Servicios } from '@/services/Servicios'
import { eliminarCookie, guardarCookie, leerCookie } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { verificarToken } from '@/utils/token'
import { Constantes } from '@/config/Constantes'

const estadosSinPermiso = [401]

const cerrarSesionDirecto = () => {
  eliminarCookie('token')
  window.location.href = '/login'
}

const actualizarTokenDirecto = async (): Promise<boolean> => {
  try {
    const respuesta = await Servicios.post({
      url: `${Constantes.authUrl}/token`,
      body: { token: leerCookie('token') },
    })
    guardarCookie('token', respuesta.datos?.access_token)
    return true
  } catch {
    cerrarSesionDirecto()
    return false
  }
}

/**
 * Función plana de petición autenticada — úsala en archivos de servicio (.ts).
 * Equivale a `usePeticion().sesionPeticion` pero sin violar las reglas de hooks.
 */
export const sesionPeticion = async <T = any>({
  url,
  method = 'get',
  body,
  headers,
  params,
  responseType,
  withCredentials,
}: peticionFormatoMetodo): Promise<T> => {
  try {
    if (!verificarToken(leerCookie('token') ?? '')) {
      imprimir(`Token caducado ⏳`)
      const actualizado = await actualizarTokenDirecto()
      if (!actualizado) return {} as T
    }

    const cabeceras = {
      accept: 'application/json',
      Authorization: `Bearer ${leerCookie('token') ?? ''}`,
      ...headers,
    }

    imprimir(`enviando 🔐🌍`, body, method, url, cabeceras)
    const response = await Servicios.peticionHTTP<T>({
      url,
      method,
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
      cerrarSesionDirecto()
      return {} as T
    }
    throw e.response?.data || 'Ocurrió un error desconocido'
  }
}
