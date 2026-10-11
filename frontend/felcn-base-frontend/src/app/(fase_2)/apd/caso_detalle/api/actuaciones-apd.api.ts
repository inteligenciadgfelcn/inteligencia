import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type {
  ActuacionPayload,
  ActuacionRow,
  TipoInforme,
} from '../types/actuaciones-apd.types'

const BASE = `${Constantes.baseUrl}/actuaciones`
const BASE_PARAMETRICAS = `${Constantes.baseUrl}/parametricas-lgi`

interface RespuestaPaginada<T> {
  finalizado: boolean
  mensaje: string
  datos: { total: number; filas: T[] }
}

export const ActuacionesApi = {
  async listarActuaciones(
    casoId: number,
    params: { pagina: number; limite: number }
  ): Promise<{ total: number; filas: ActuacionRow[] }> {
    const respuesta = await sesionPeticion<RespuestaPaginada<ActuacionRow>>({
      url: `${BASE}/caso/${casoId}`,
      method: 'get',
      params,
      withCredentials: true,
    })
    return respuesta.datos
  },

  crearActuacion(payload: ActuacionPayload): Promise<{ message: string }> {
    const fd = new FormData()
    fd.append('casosId', String(payload.casosId))
    fd.append('opNrooper', payload.opNrooper)
    fd.append('idTipoInforme', String(payload.idTipoInforme))
    if (payload.otroInforme) {
      fd.append('otroInforme', payload.otroInforme)
    }
    fd.append('opLugar', payload.opLugar)
    fd.append('opDescripcion', payload.opDescripcion)
    if (payload.archivo) {
      fd.append('archivo', payload.archivo)
    }

    return sesionPeticion({
      url: `${BASE}`,
      method: 'post',
      body: fd,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },

  listarTiposInforme(): Promise<TipoInforme[]> {
    return sesionPeticion<TipoInforme[]>({
      url: `${BASE_PARAMETRICAS}/allTipoInforme`,
      method: 'get',
      withCredentials: true,
    })
  },

  obtenerActuacion(opId: number): Promise<ActuacionRow> {
    return sesionPeticion<ActuacionRow>({
      url: `${BASE}/${opId}`,
      method: 'get',
      withCredentials: true,
    })
  },

  exportarActuacionPdf(opId: number): Promise<Blob> {
    return sesionPeticion<Blob>({
      url: `${Constantes.baseUrl}/reportes-lgi/export/pdf/actuacion/${opId}`,
      method: 'get',
      responseType: 'blob',
      headers: { accept: 'application/pdf' },
      withCredentials: true,
    })
  },
}
