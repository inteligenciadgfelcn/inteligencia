import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type {
  BienCaracteristicaPayload,
  BienCaracteristicaResponse,
  BienPayload,
  BienResponse,
  RespuestaApi,
  RespuestaApiPaginada,
} from './types'

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
    return Servicios.get({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes?pagina=${pagina}&limite=${limite}`,
    })
  },

  crear(
    idOperativo: number,
    payload: BienPayload
  ): Promise<RespuestaApi<unknown>> {
    return Servicios.post({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes`,
      body: buildFormData(payload),
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  eliminar(
    idOperativo: number,
    idBien: number
  ): Promise<RespuestaApi<unknown>> {
    return Servicios.delete({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/${idBien}`,
    })
  },

  listarCaracteristicas(
    idOperativo: number,
    idBien: number
  ): Promise<RespuestaApi<RespuestaApiPaginada<BienCaracteristicaResponse>>> {
    return Servicios.get({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/${idBien}/caracteristicas`,
    })
  },

  crearCaracteristica(
    idOperativo: number,
    idBien: number,
    payload: BienCaracteristicaPayload
  ): Promise<RespuestaApi<unknown>> {
    return Servicios.post({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/${idBien}/caracteristicas`,
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    })
  },

  eliminarCaracteristica(
    idOperativo: number,
    idBien: number,
    idCaracteristica: number
  ): Promise<RespuestaApi<unknown>> {
    return Servicios.delete({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/${idBien}/caracteristicas/${idCaracteristica}`,
    })
  },

  obtenerFoto(path: string): Promise<Blob> {
    const pathNormalizado = path.replace(/^\/api/, '')
    return Servicios.get<Blob>({
      url: `${Constantes.baseUrl}${pathNormalizado}`,
      responseType: 'blob',
    })
  },
}
