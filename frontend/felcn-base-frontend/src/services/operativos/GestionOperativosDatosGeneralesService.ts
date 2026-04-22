import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import type {
  CasoResumen,
  OperativoPayload,
  OperativoResponse,
  RespuestaApi,
} from './types'

const { sesionPeticion } = usePeticion()
const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

// ── Tipos del endpoint GET /operativos/caso/:idCaso ──────────────────────────

export interface CasoOperativoDetalle {
  caso: CasoResumen
  operativos: OperativoResponse[]
}

// ── Servicio ─────────────────────────────────────────────────────────────────

export const GestionOperativosDatosGeneralesService = {
  obtenerPorUsuario(
    idCaso: number
  ): Promise<RespuestaApi<CasoOperativoDetalle>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/caso/${idCaso}`,
      withCredentials: true,
    })
  },

  crearOperativo(
    idCaso: number,
    payload: OperativoPayload
  ): Promise<RespuestaApi<CasoOperativoDetalle>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/caso/${idCaso}`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  actualizarOperativo(
    idOperativo: number,
    payload: OperativoPayload
  ): Promise<RespuestaApi<CasoOperativoDetalle>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}`,
      method: 'PATCH',
      body: payload,
      withCredentials: true,
    })
  },
}
