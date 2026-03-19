import { usePeticion } from '@/hooks'
import { CasoActualizacionTable } from '../types/caso.actualizacion.table'
import { Constantes } from '@/config/Constantes'
import { DataTableParams } from '@/services'

export interface OpertaivosResponse {
  finalizado: boolean
  mensaje: string
  datos: Datos
}

interface Datos {
  total: number
  filas: CasoActualizacionTable[]
}
const { sesionPeticion } = usePeticion()

export const getActualizacionData = async (
  registrados: boolean,
  params: DataTableParams
): Promise<OpertaivosResponse> => {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/asignaciones/operativos`,
    params: {
      ...params,
      registrados: registrados ? 'true' : 'false',
      codigo: 'ICIA-1818032026',
    },
    withCredentials: true,
  })
  return response
}
