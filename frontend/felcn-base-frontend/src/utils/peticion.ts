import { peticionFormatoMetodo, Servicios } from '@/services/Servicios'
import { eliminarCookie, guardarCookie, leerCookie } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { verificarToken } from '@/utils/token'
import { Constantes } from '@/config/Constantes'

const estadosSinPermiso = [401]

const cerrarSesionDirecto = () => {
  eliminarCookie('token')
  window.location.href = Constantes.loginPath
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
  if (!verificarToken(leerCookie('token') ?? '')) {
    imprimir(`Token caducado ⏳`)
    const actualizado = await actualizarTokenDirecto()
    if (!actualizado) {
      // actualizarTokenDirecto ya cerró la sesión y redirigió a /login: no continuar con la petición
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
      // No continuar como si la petición hubiera tenido éxito: la sesión ya se cerró
      throw e.response?.data || new Error('Sesión finalizada')
    }
    throw e.response?.data || 'Ocurrió un error desconocido'
  }
}

/**
 * Descarga un archivo protegido por sesión (ej. PDF de reporte) y dispara la descarga en el
 * navegador. A diferencia de `window.open(url)`, esta petición sí adjunta el header
 * `Authorization`, necesario porque los endpoints de reportes están detrás de `JwtAuthGuard`.
 */
export const descargarArchivoAutenticado = async (url: string, nombreArchivo: string): Promise<void> => {
  const blob = await sesionPeticion<Blob>({ url, responseType: 'blob' })
  const objectUrl = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = objectUrl
  enlace.download = nombreArchivo
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  URL.revokeObjectURL(objectUrl)
}
