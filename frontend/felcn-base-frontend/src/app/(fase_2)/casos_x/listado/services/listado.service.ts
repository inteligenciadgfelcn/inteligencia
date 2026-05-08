import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'
import { DataTableParams } from '@/services'
import { OperativosResponse } from '../types/listado.types'

export async function getOperativos(
  params: DataTableParams
): Promise<OperativosResponse> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/operativo`,
    params,
    withCredentials: true,
  })

  return response
}
