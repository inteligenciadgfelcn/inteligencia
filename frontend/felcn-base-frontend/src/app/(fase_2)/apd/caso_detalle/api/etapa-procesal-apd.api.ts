import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type {
  EstadoEtapa,
  EtapaCatalogo,
  EtapaProcesalRow,
  RegistrarEtapaProcesalPayload,
} from '../types/etapa-procesal-apd.types'

const BASE = `${Constantes.baseUrl}/asignacion-pd`
const BASE_PARAMETRICAS = `${Constantes.baseUrl}/parametricas-lgi`

export const EtapaProcesalApi = {
  listarEtapas(): Promise<EtapaCatalogo[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allEtapaPd`,
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

    fd.append('fechaEtapa', payload.fechaEtapa)
    fd.append('diasOtorgados', String(payload.diasOtorgados))

    if (payload.formalizacionAccion?.trim()) {
      fd.append('formalizacionAccion', payload.formalizacionAccion.trim())
    }

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