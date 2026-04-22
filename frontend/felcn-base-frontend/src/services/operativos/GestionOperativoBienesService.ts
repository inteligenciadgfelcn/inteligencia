import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import type {
  BienCaracteristicaPayload,
  BienCaracteristicaResponse,
  BienPayload,
  BienResponse,
  RespuestaApi,
  RespuestaApiPaginada,
} from './types'

const { sesionPeticion } = usePeticion()
const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

const buildFormData = (payload: BienPayload) => {
  const formData = new FormData()
  formData.append('idCatalogoTipo', String(payload.idCatalogoTipo))
  formData.append('cantidadBien', String(payload.cantidadBien))
  formData.append('costoAproximado', String(payload.costoAproximado))
  formData.append('costoCuantificado', String(payload.costoCuantificado))
  formData.append('enInvestigacion', String(payload.enInvestigacion))
  if (payload.foto) {
    formData.append('foto', payload.foto)
  }
  return formData
}

export const GestionOperativoBienesService = {
  listar(
    idOperativo: number,
    pagina: number = 1,
    limite: number = 10
  ): Promise<RespuestaApi<RespuestaApiPaginada<BienResponse>>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes?pagina=${pagina}&limite=${limite}`,
      withCredentials: true,
    })
  },

  crear(
    idOperativo: number,
    payload: BienPayload
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes`,
      method: 'POST',
      body: buildFormData(payload),
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },

  eliminar(
    idOperativo: number,
    idBien: number
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/${idBien}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  listarCaracteristicas(
    idOperativo: number,
    idBien: number
  ): Promise<RespuestaApi<RespuestaApiPaginada<BienCaracteristicaResponse>>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/${idBien}/caracteristicas`,
      withCredentials: true,
    })
  },

  crearCaracteristica(
    idOperativo: number,
    idBien: number,
    payload: BienCaracteristicaPayload
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/${idBien}/caracteristicas`,
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
  },

  eliminarCaracteristica(
    idOperativo: number,
    idBien: number,
    idCaracteristica: number
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/${idBien}/caracteristicas/${idCaracteristica}`,
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
