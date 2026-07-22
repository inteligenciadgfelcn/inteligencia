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
  idColor?: number
}

export interface PaginaFlujoTransporte {
  filas: FlujoTransporteReporteFila[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
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
  if (filtro.idColor) params.idColor = String(filtro.idColor)
  return params
}

/**
 * Servicio de reporte de Flujo de Transporte: listado paginado filtrable por
 * documento, placa, rango de fechas y/o color; últimos N registros para el
 * tab con auto-refresh; y descarga del listado (sin paginar) en PDF.
 */
export const ReportesFlujoTransporteService = {
  listar(
    filtro: FiltroFlujoTransporteReporte = {},
    pagina: number = 1,
    limite: number = 10
  ): Promise<RespuestaApi<PaginaFlujoTransporte>> {
    return sesionPeticion({
      url: BASE,
      params: { ...armarParams(filtro), pagina: String(pagina), limite: String(limite) },
      withCredentials: true,
    })
  },

  listarRecientes(limite: number = 10): Promise<RespuestaApi<FlujoTransporteReporteFila[]>> {
    return sesionPeticion({
      url: `${BASE}/recientes`,
      params: { limite: String(limite) },
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
