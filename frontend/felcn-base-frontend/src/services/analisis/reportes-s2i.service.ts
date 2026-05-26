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

// ─── Tipos vista previa ───────────────────────────────────────────────────────

export interface DetalleAntecedentePreview {
  descripcionTipoDelito: string | null
  descripcionPais: string | null
  lugarHecho: string
  nroCaso: string
  fechaHecho: string
  hecho: string
}

export interface RedSocialPreview {
  tipoRed: string
  direccion: string
}

export interface LugarGisPreview {
  descripcion: string
  coordenadasX: number
  coordenadasY: number
  contenido: string
}

export interface BlancoDetallePreview {
  idBlanco: string
  deNombres: string
  dePaterno: string
  deMaterno: string
  deEsposo: string
  alias: string
  descripcionPais: string | null
  antecedentes: DetalleAntecedentePreview[]
  redesSociales: RedSocialPreview[]
  lugares: LugarGisPreview[]
}

export interface OrganizacionDetallePreview {
  idEmpresa: string
  descripcionTipoOrganizacion: string | null
  nombre: string
  nit: string
  matricula: string
  representante: string
  observaciones: string
  lugares: LugarGisPreview[]
}

export interface BienDetallePreview {
  idItemBienSecundario: string
  descripcionBien: string | null
  descripcionClase: string | null
  descripcionTipo: string | null
  descripcionTipoInvestigacion: string | null
  caracteristicas: { descripcionCaracteristica: string | null; descripcion: string }[]
}

export interface DetalleCasoPreview {
  caso: {
    idCaso: string
    nroCasoCer: string | null
    nombreCaso: string
    lugar: string
    antecedentes: string | null
    fechaInicio: string
    pais: string | null
    estadoCaso: string | null
    etapaInvestigacion: string | null
  }
  blancos: BlancoDetallePreview[]
  organizaciones: OrganizacionDetallePreview[]
  bienes: BienDetallePreview[]
}

export interface MarcadorGis {
  lat: number
  lon: number
  descripcion: string
  tipo: 'blanco' | 'organizacion' | 'bien'
}

export interface GisCasoPreview {
  caso: {
    idCaso: string
    nombreCaso: string
    nroCasoCer: string | null
    pais: string | null
    lugar: string
    estadoCaso: string | null
    etapaInvestigacion: string | null
    fechaInicio: string
  }
  marcadores: MarcadorGis[]
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

  /** Vista previa del reporte detallado (RPT-MN-01) en JSON. */
  verDetalle(idCaso: string) {
    return sesionPeticion<{ finalizado: boolean; datos: DetalleCasoPreview }>({
      url: `${BASE}/${idCaso}/detalle`,
      withCredentials: true,
    })
  },

  /** Vista previa del reporte GIS (RPT-MN-02) en JSON. */
  verGis(idCaso: string) {
    return sesionPeticion<{ finalizado: boolean; datos: GisCasoPreview }>({
      url: `${BASE}/${idCaso}/gis`,
      withCredentials: true,
    })
  },
}
