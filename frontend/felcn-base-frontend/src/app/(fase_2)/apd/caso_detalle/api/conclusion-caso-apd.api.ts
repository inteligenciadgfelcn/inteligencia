import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type {
  ConclusionCasoActual,
  ConclusionCasoPayload,
} from '../types/conclusion-caso-apd.types'

const BASE = `${Constantes.baseUrl}/conclusion-caso`
const BASE_REPORTES = `${Constantes.baseUrl}/reportes-lgi`

export const ConclusionCasoApi = {
  obtenerConclusionCaso(casoId: number): Promise<ConclusionCasoActual> {
    return sesionPeticion<ConclusionCasoActual>({
      url: `${BASE}/${casoId}`,
      method: 'get',
      withCredentials: true,
    })
  },

  guardarConclusionCaso(
    payload: ConclusionCasoPayload
  ): Promise<ConclusionCasoActual> {
    return sesionPeticion<ConclusionCasoActual>({
      url: BASE,
      method: 'post',
      body: payload,
      withCredentials: true,
    })
  },

  exportarConclusionCasoPdf(casoId: number): Promise<Blob> {
    return sesionPeticion<Blob>({
      url: `${BASE_REPORTES}/export/pdf/caso/${casoId}`,
      method: 'get',
      responseType: 'blob',
      headers: { accept: 'application/pdf' },
      withCredentials: true,
    })
  },
}
