import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

const BASE = `${Constantes.baseUrl}/reportes`

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface PreviewCaso {
  nombreCaso: string
  numeroOperativo: string
  asignadoCaso: string
  fiscalAsignadoCaso: string
}

export interface PreviewOperativo {
  id: string
  numeroOperativo: string
  fechaOperativo: string | null
  lugar: string
  descripcionUnidad: string | null
  descripcionPlanOperaciones: string | null
  descripcionTipoOperativo: string | null
  breveDetalle: string | null
  descripcion: string | null
  coordX: number | null
  coordY: number | null
}

export interface PreviewDroga {
  descripcionTipoDroga: string | null
  descripcionEstadoDroga: string | null
  cantidadGramos: number | null
  cantidad: number | null
  costo: number | null
  descripcionFormaTransporte: string | null
  descripcionPaisProcedencia: string | null
  descripcionPaisDestino: string | null
}

export interface PreviewSustancia {
  descripcionSustancia: string | null
  cantidad: number | null
  costo: number | null
}

export interface PreviewFabrica {
  descripcionTipoFabrica: string | null
  descripcionFabricaModelo: string | null
  cantidad: number | null
}

export interface PreviewPersona {
  nombres: string | null
  apellidoPaterno: string | null
  apellidoMaterno: string | null
  descripcionPais: string | null
  genero: string | null
  fechaNacimiento: string | null
  descripcionEstadoCivil: string | null
  descripcionTipoDocumento: string | null
  nroDocumento: string | null
  direccion: string | null
  estado: string | null
}

export interface PreviewBien {
  descripcionBien: string | null
  descripcionCatalogoClase: string | null
  descripcionCatalogoTipo: string | null
  cantidadBien: number | null
  caracteristicas: { label: string | null; value: string }[]
}

export interface PreviewGaleria {
  id: string
  descripcion: string | null
}

export interface PreviewOperativoData {
  caso: PreviewCaso
  operativo: PreviewOperativo
  drogas: PreviewDroga[]
  sustanciasSolidas: PreviewSustancia[]
  sustanciasLiquidas: PreviewSustancia[]
  fabricas: PreviewFabrica[]
  personas: PreviewPersona[]
  bienes: PreviewBien[]
  galerias: PreviewGaleria[]
  mapaCoords: { lat: number; lon: number } | null
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const ReportesOperativoService = {
  /** Vista previa del Formulario Operativo en JSON (sin imágenes). */
  verPreviewOperativo(numero: string) {
    return sesionPeticion<{ finalizado: boolean; datos: PreviewOperativoData }>({
      url: `${BASE}/operativo/preview`,
      params: { numero },
      withCredentials: true,
    })
  },

  /** Vista previa del Reporte General en JSON (sin imágenes). */
  verPreviewGeneral(numero: string) {
    return sesionPeticion<{ finalizado: boolean; datos: PreviewOperativoData }>({
      url: `${BASE}/general/preview`,
      params: { numero },
      withCredentials: true,
    })
  },
}
