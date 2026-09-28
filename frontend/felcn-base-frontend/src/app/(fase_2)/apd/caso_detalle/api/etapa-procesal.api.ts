import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type {
  EstadoEtapa,
  EtapaCatalogo,
  EtapaProcesalRow,
  RegistrarEtapaProcesalPayload,
} from '../types/etapa-procesal.types'

const BASE = `${Constantes.baseUrl}/asignacion-lgi`
const BASE_PARAMETRICAS = `${Constantes.baseUrl}/parametricas-lgi`

export const EtapaProcesalApi = {
  listarEtapas(): Promise<EtapaCatalogo[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allEtapa`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarEstadosEtapa(idEtapa: number): Promise<EstadoEtapa[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/estado/${idEtapa}`,
      method: 'get',
      withCredentials: true,
    })
  },

  async listarEtapasCaso(casosId: number): Promise<EtapaProcesalRow[]> {
    const respuesta = await sesionPeticion<
      EtapaProcesalRow[] | { datos?: EtapaProcesalRow[] }
    >({
      url: `${BASE}/caso/${casosId}`,
      method: 'get',
      withCredentials: true,
    })

    return Array.isArray(respuesta) ? respuesta : (respuesta.datos ?? [])
  },

  registrarEtapa(
    casosId: number,
    payload: RegistrarEtapaProcesalPayload,
    documento?: File
  ): Promise<{ message?: string }> {
    const fd = new FormData()
    fd.append('etapaId', String(payload.etapaId))

    if (payload.idEstado !== undefined) {
      fd.append('idEstado', String(payload.idEstado))
    }

    fd.append('fechaRecepcionFiscalia', payload.fechaRecepcionFiscalia)
    fd.append('diasOtorgados', String(payload.diasOtorgados))

    if (payload.descripcionDocumento?.trim()) {
      fd.append('descripcionDocumento', payload.descripcionDocumento.trim())
    }

    if (documento) {
      fd.append('documento', documento)
    }

    return sesionPeticion({
      url: `${BASE}/${casosId}`,
      method: 'post',
      body: fd,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },
}