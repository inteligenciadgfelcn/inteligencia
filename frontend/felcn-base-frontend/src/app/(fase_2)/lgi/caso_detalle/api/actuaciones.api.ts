import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type {
  ActuacionPayload,
  ActuacionRow,
  DetalleEtapa,
  TipoInforme,
} from '../types/actuaciones.types'

const BASE = `${Constantes.baseUrl}/actuaciones`
const BASE_PARAMETRICAS = `${Constantes.baseUrl}/parametricas-lgi`

interface RespuestaPaginada<T> {
  finalizado: boolean
  mensaje: string
  datos: { total: number; filas: T[] }
}

export const ETAPAS: Array<{ et_id: number; descripcion: string }> = [
  { et_id: 1, descripcion: 'Preliminar' },
  { et_id: 2, descripcion: 'Preparatoria' },
  { et_id: 3, descripcion: 'Juicio Oral' },
]

export const ActuacionesApi = {
  async listarActuaciones(
    casoId: number,
    params: { pagina: number; limite: number }
  ): Promise<{ total: number; filas: ActuacionRow[] }> {
    const respuesta = await sesionPeticion<
      RespuestaPaginada<ActuacionRow>
    >({
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
    fd.append('idEtapa', String(payload.idEtapa))
    fd.append('idEstado', String(payload.idEstado))
    fd.append('diasOtorgados', String(payload.diasOtorgados))
    fd.append('fechaRecepcionFiscalia', payload.fechaRecepcionFiscalia)
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

  listarDetallesEtapa(idEtapa: number): Promise<DetalleEtapa[]> {
    return sesionPeticion<DetalleEtapa[]>({
      url: `${BASE_PARAMETRICAS}/estado/${idEtapa}`,
      method: 'get',
      withCredentials: true,
    })
  },
}
