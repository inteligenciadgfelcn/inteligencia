import { usePeticion } from '@/hooks'
import { DataTableParams } from '@/services'
import { FiliacionPersonaTable } from '../type/filiacion.persona.table'
import { Constantes } from '@/config/Constantes'

export interface PersonasFiliacionResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: FiliacionPersonaTable[]
  }
}

const { sesionPeticion } = usePeticion()

export async function getPersonasFiliacionPorCaso(
  params: DataTableParams,
  nroCaso: string | number,
  /// Filiado (1), No Filiado (0)
  statusFiliacion: number
): Promise<PersonasFiliacionResponse> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/filiacion/personas/${encodeURIComponent(nroCaso)}/${statusFiliacion}`,
    params: params,
    withCredentials: true,
  })

  return response
}
