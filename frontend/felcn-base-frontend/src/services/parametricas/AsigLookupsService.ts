import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import type { RespuestaAPI, UnidadAsig } from './types'

const BASE = `${Constantes.baseUrl}/asig-lookups`

/**
 * Servicio para los lookups del módulo de Asignaciones.
 *
 * Endpoints cubiertos:
 *  - GET /api/asig-lookups/unidades
 */
export const AsigLookupsService = {
  /**
   * Obtiene todas las unidades disponibles para asignaciones.
   * Cada unidad tiene { idUnidad: string, descripcion: string }.
   */
  obtenerUnidades(): Promise<RespuestaAPI<UnidadAsig>> {
    return Servicios.get({ url: `${BASE}/unidades` })
  },
}
