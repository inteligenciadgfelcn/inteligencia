import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

const BASE = `${Constantes.baseUrl}/s2i/reportes/casos`

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Fila que devuelve GET /s2i/reportes/casos */
export interface CasoReporteS2i {
  idCaso: string
  nroCasoCer: string | null
  pais: string | null
  lugar: string
  nombreCaso: string
  estadoCaso: string | null
  etapaInvestigacion: string | null
  fechaInicio: string
  antecedentes: string | null
}

export interface FiltrosCasosReporte {
  nombre?: string
  estado?: string
  antecedente?: string
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Servicio de reportes S2I.
 * Conecta con los endpoints migrados desde FRM-RP-01, FRM-RP-02, RPT-MN-01 y RPT-MN-02.
 */
export const ReportesS2iService = {
  /** Lista los casos del usuario autenticado con filtros opcionales (FRM-RP-01 / FRM-RP-02). */
  listar(filtros: FiltrosCasosReporte = {}) {
    const params: Record<string, string> = {}
    if (filtros.nombre?.trim()) params.nombre = filtros.nombre.trim()
    if (filtros.estado?.trim()) params.estado = filtros.estado.trim()
    if (filtros.antecedente?.trim()) params.antecedente = filtros.antecedente.trim()

    return sesionPeticion<{ finalizado: boolean; datos: CasoReporteS2i[] }>({
      url: BASE,
      params,
      withCredentials: true,
    })
  },

  /**
   * Descarga el reporte detallado de un caso como PDF (RPT-MN-01).
   * Devuelve un Blob para ser convertido a URL de descarga en el cliente.
   */
  descargarPdf(idCaso: string): Promise<Blob> {
    return sesionPeticion<Blob>({
      url: `${BASE}/${idCaso}/pdf`,
      responseType: 'blob',
      withCredentials: true,
    })
  },

  /**
   * Descarga el reporte GIS de un caso como PDF (RPT-MN-02).
   * Devuelve un Blob con el mapa Leaflet renderizado por Puppeteer.
   */
  descargarGisPdf(idCaso: string): Promise<Blob> {
    return sesionPeticion<Blob>({
      url: `${BASE}/${idCaso}/gis/pdf`,
      responseType: 'blob',
      withCredentials: true,
    })
  },
}
