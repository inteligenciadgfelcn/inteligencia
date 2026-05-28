import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  LogotipoCasoPayload,
  RespuestaApi,
  RespuestaApiPaginada,
} from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

const buildFormData = (payload: LogotipoCasoPayload) => {
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
    idCaso: number,
    idDroga: number,
    pagina: number = 1,
    limite: number = 10
  ): Promise<RespuestaApi<RespuestaApiPaginada<unknown>>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idCaso}/drogas/${idDroga}/logotipos?pagina=${pagina}&limite=${limite}`,
      withCredentials: true,
    })
  },

  crear(
    idCaso: number,
    idDroga: number,
    payload: LogotipoCasoPayload
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idCaso}/drogas/${idDroga}/logotipos`,
      method: 'POST',
      body: buildFormData(payload),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })
  },

  eliminar(
    idCaso: number,
    idDroga: number,
    idLogotipo: number
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idCaso}/drogas/${idDroga}/logotipos/${idLogotipo}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  obtenerFoto(path: string): Promise<Blob> {
    const pathNormalizado = path.replace(/^\/api/, '')
    return sesionPeticion<Blob>({
      url: `${Constantes.baseUrl}${pathNormalizado}`,
      responseType: 'blob',
      withCredentials: true,
    })
  },
}
