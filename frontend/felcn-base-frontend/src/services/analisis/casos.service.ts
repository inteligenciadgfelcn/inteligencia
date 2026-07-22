import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { CasoS2i, CreateCasoPayload, RespuestaApi } from './types'

const BASE = `${Constantes.baseUrl}/s2i/casos`

export const CasosS2iService = {
  calcularNumero(idPais: number, gestion: number): Promise<RespuestaApi<{ numeroCaso: string }>> {
    return sesionPeticion({
      url: `${BASE}/numero-siguiente?idPais=${idPais}&gestion=${gestion}`,
      withCredentials: true,
    })
  },

  crear(payload: CreateCasoPayload): Promise<RespuestaApi<CasoS2i>> {
    return sesionPeticion({
      url: BASE,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listar(idEtapa?: number): Promise<RespuestaApi<CasoS2i[]>> {
    const params = idEtapa ? `?idEtapa=${idEtapa}` : ''
    return sesionPeticion({ url: `${BASE}${params}`, withCredentials: true })
  },

  buscarPorId(idCaso: string): Promise<RespuestaApi<CasoS2i>> {
    return sesionPeticion({ url: `${BASE}/${idCaso}`, withCredentials: true })
  },

  eliminar(idCaso: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/${idCaso}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },
}
