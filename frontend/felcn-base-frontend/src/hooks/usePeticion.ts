import { peticionFormatoMetodo, Servicios } from '@/services/Servicios'
import { leerCookie } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { verificarToken } from '@/utils/token'

export const usePeticion = () => {
  const sesionPeticion = async <T = any>({
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
        // await actualizarSesion()
      }

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

      throw e.response?.data || 'Ocurrió un error desconocido'
    }
  }

  return { sesionPeticion }
}
