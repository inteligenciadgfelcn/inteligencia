import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import { OperativoDetalleResponse } from '../types/buscar-operativo.types'


export async function getOperativoDetalle(
  nroOperativo: string
): Promise<OperativoDetalleResponse> {
  const response = await sesionPeticion<OperativoDetalleResponse>({
    url: `${Constantes.baseUrl}/operativo/${encodeURIComponent(nroOperativo.trim())}`,
    withCredentials: true,
  })

  return response
}
