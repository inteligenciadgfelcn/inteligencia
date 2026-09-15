import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import { DetalleDetenido } from '../types/detenido.types'

export function getDetalleDetenido(
  idDetenido: string | number
): Promise<DetalleDetenido> {
  return sesionPeticion({
    url: `${Constantes.baseUrl}/reporte/detenido/${encodeURIComponent(
      String(idDetenido)
    )}/detalle`,
    withCredentials: true,
  })
}