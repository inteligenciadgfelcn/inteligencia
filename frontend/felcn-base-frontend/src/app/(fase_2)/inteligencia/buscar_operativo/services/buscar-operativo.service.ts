import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import { OperativoDetalleResponse } from '../types/buscar-operativo.types'

const { sesionPeticion } = usePeticion()

export async function getOperativoDetalle(
  nroOperativo: string
): Promise<OperativoDetalleResponse> {
  const response = await sesionPeticion<OperativoDetalleResponse>({
    url: `${Constantes.baseUrl}/operativo/${encodeURIComponent(nroOperativo.trim())}`,
    withCredentials: true,
  })

  return response
}
