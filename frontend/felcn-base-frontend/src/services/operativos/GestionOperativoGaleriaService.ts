import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import type {
  GaleriaPayload,
  GaleriaResponse,
  RespuestaApi,
  RespuestaApiPaginada,
} from './types'

const { sesionPeticion } = usePeticion()
const BASE = `${Constantes.baseUrl}/operativos`

const buildFormData = (payload: GaleriaPayload): FormData => {
  const fd = new FormData()
  fd.append('descripcion', payload.descripcion)
  fd.append('idTipoTamano', String(payload.idTipoTamano))
  if (payload.foto) fd.append('foto', payload.foto)
  return fd
}

export const GestionOperativoGaleriaService = {
  listar(
    idOperativo: number,
    pagina: number = 1,
    limite: number = 10
  ): Promise<RespuestaApi<RespuestaApiPaginada<GaleriaResponse>>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/galeria?pagina=${pagina}&limite=${limite}`,
      withCredentials: true,
    })
  },

  crear(
    idOperativo: number,
    payload: GaleriaPayload
  ): Promise<RespuestaApi<GaleriaResponse>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/galeria`,
      method: 'POST',
      body: buildFormData(payload),
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },

  eliminar(
    idOperativo: number,
    idGaleria: number
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/galeria/${idGaleria}`,
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
