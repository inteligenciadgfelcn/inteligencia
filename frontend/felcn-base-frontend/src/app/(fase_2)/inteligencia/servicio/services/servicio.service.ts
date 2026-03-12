import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'
import { ServicioTable } from '../types/servicio.table'
import { DataTableParams } from '@/services'

export interface ServiciosResponse {
  finalizado: boolean
  mensaje: string
  datos: Datos
}

interface Datos {
  total: number
  filas: ServicioTable[]
}

const { sesionPeticion } = usePeticion()

export async function getServicios(
  params: DataTableParams
): Promise<ServiciosResponse> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/servicio`,
    params: params,
    withCredentials: true,
  })

  return response
}
