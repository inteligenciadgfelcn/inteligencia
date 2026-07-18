import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { RespuestaApi } from './types'

const BASE = `${Constantes.baseUrl}/s2i/reportes/flujo-transporte`

export interface FiltroFlujoTransporteReporte {
  documento?: string
  placa?: string
  /** Fecha ISO (YYYY-MM-DD) */
  fechaDesde?: string
  /** Fecha ISO (YYYY-MM-DD) */
  fechaHasta?: string
}

export interface FlujoTransporteReporteFila {
  idFlujoTransporte: string
  codigoTransporte: string
  numeroDocumento: string
  conductorNombreCompleto: string | null
  transporteMarca: string | null
  transporteModelo: string | null
  lugarDescripcion: string | null
  origen: string
  destino: string
  carga: string
  fechaHora: string
  idColor: number
  colorNombre: string | null
  colorDescripcion: string | null
  colorHex: string | null
  latitud: number
  longitud: number
}

const armarParams = (filtro: FiltroFlujoTransporteReporte) => {
  const params: Record<string, string> = {}
  if (filtro.documento?.trim()) params.documento = filtro.documento.trim()
  if (filtro.placa?.trim()) params.placa = filtro.placa.trim()
  if (filtro.fechaDesde) params.fechaDesde = filtro.fechaDesde
  if (filtro.fechaHasta) params.fechaHasta = filtro.fechaHasta
  return params
}

/**
 * Servicio de reporte de Flujo de Transporte: listado JSON filtrable por
 * documento, placa y rango de fechas, y descarga del mismo listado en PDF.
 */
export const ReportesFlujoTransporteService = {
  listar(
    filtro: FiltroFlujoTransporteReporte = {}
  ): Promise<RespuestaApi<FlujoTransporteReporteFila[]>> {
    return sesionPeticion({
      url: BASE,
      params: armarParams(filtro),
      withCredentials: true,
    })
  },

  descargarPdf(filtro: FiltroFlujoTransporteReporte = {}): Promise<Blob> {
    return sesionPeticion({
      url: `${BASE}/pdf`,
      params: armarParams(filtro),
      responseType: 'blob',
      withCredentials: true,
    })
  },
}
