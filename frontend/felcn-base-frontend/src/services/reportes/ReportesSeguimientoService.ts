import { Constantes } from '@/config/Constantes'

const BASE = `${Constantes.baseUrl}/reportes/seguimiento`

export const ReportesSeguimientoService = {
  /** URL del PDF del Reporte de Seguimiento de Caso. */
  urlPdf(idCaso: string) {
    return `${BASE}/pdf?idCaso=${encodeURIComponent(idCaso)}`
  },
}
