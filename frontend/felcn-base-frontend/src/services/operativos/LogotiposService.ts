import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  LogotipoPayload,
  LogotipoResponse,
  RespuestaApi,
  RespuestaApiPaginada,
} from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

const buildFormData = (payload: LogotipoPayload) => {
  const formData = new FormData()

  formData.append('imagen', payload.imagen)
  formData.append('descripcionLogo', payload.descripcionLogo)
  formData.append('organizacion', payload.organizacion)
  if (payload.fotografia) {
    formData.append('fotografia', payload.fotografia)
  }

  if (payload.blanco) {
    formData.append('blanco', payload.blanco)
  }

  if (payload.observacion) {
    formData.append('observacion', payload.observacion)
  }

  return formData
}

export const LogotiposService = {
  listar(
    idOperativo: number,
    pagina: number = 1,
    limite: number = 10
  ): Promise<RespuestaApi<RespuestaApiPaginada<LogotipoResponse>>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/logotipos?pagina=${pagina}&limite=${limite}`,
      withCredentials: true,
    })
  },

  crear(
    idOperativo: number,
    payload: LogotipoPayload
  ): Promise<RespuestaApi<LogotipoResponse>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/logotipos`,
      method: 'POST',
      body: buildFormData(payload),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })
  },

  eliminar(
    idOperativo: number,
    idLogotipo: number
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/logotipos/${idLogotipo}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  obtenerFoto(path: string): Promise<Blob> {
    if (!path) return Promise.reject(new Error('Path no proporcionado'))
    const pathNormalizado = path.replace(/^\/api/, '')
    return sesionPeticion<Blob>({
      url: `${Constantes.baseUrl}${pathNormalizado}`,
      responseType: 'blob',
      withCredentials: true,
    })
  },
}
