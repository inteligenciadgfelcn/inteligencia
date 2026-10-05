import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import { ResultadoBusquedaAvanzada } from '../../registro_caso/types/siii.types'

const BASE = `${Constantes.baseUrl}/presedencia-lgi`

export interface PresedenciaCasoRow {
  preseId: string
  casosId: string
  nrocasopre: string
  estado: string
  usuario: string
  usuarioActualizacion: string | null
  fechaHoraIng: string
  fechaActualizacion: string | null
  operativosSiii: ResultadoBusquedaAvanzada[]
}

interface RespuestaPaginada {
  finalizado: boolean
  mensaje: string
  datos: { total: number; filas: PresedenciaCasoRow[] }
}

export const PresedenciaApi = {
  async listarPorCaso(
    casosId: string | number,
    params: { pagina: number; limite: number }
  ): Promise<{ total: number; filas: PresedenciaCasoRow[] }> {
    const respuesta = await sesionPeticion<RespuestaPaginada>({
      url: `${BASE}/caso/${casosId}`,
      method: 'get',
      params,
      withCredentials: true,
    })
    return respuesta.datos
  },

  registrar(casosId: string | number, nrocasopre: string): Promise<unknown> {
    return sesionPeticion({
      url: BASE,
      method: 'post',
      body: { casosId: String(casosId), nrocasopre },
      withCredentials: true,
    })
  },

  eliminar(id: string | number): Promise<unknown> {
    return sesionPeticion({
      url: `${BASE}/${id}`,
      method: 'delete',
      withCredentials: true,
    })
  },
}