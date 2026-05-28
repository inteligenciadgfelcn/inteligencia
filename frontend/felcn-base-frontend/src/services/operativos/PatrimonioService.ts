import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  PatrimonioResponse,
  RespuestaApi,
  UpdateCostoBienPayload,
  OperativoResponse,
} from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

export const PatrimonioService = {
  // GET /operativos/:idOperativo — cabecera del operativo para mostrar datos generales
  obtenerOperativo(idOperativo: number): Promise<RespuestaApi<OperativoResponse>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}`,
      withCredentials: true,
    })
  },

  // Corresponde a calcula() de ABM-ING-COSTO: SUM(CostoCuant) en USD y en BOB
  calcularPatrimonio(
    idOperativo: number,
    tipoCambio: number = 6.92
  ): Promise<RespuestaApi<PatrimonioResponse>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/patrimonio?tipoCambio=${tipoCambio}`,
      withCredentials: true,
    })
  },

  // Corresponde a Button2_Click "Actualizar Costos" de ABM-ING-COSTO
  actualizarCostos(
    idOperativo: number,
    idBien: number,
    payload: UpdateCostoBienPayload
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/${idBien}/costos`,
      method: 'PATCH',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
  },
}
