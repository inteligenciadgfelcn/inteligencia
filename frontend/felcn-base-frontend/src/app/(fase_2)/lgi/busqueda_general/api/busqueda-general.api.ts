import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type {
  CatalogosLgi,
  DatosBuscarLgi,
  DetalleCasoLgi,
  FiltrosBusquedaLgi,
  FormatoExportacion,
  PaginacionBusquedaLgi,
  RespuestaBuscarLgi,
  RespuestaCatalogosLgi,
  RespuestaDetalleLgi,
} from '../types/busqueda-general.types'

const BASE = `${Constantes.baseUrl}/lgi/busqueda-general`

/** Límite de PaginacionQueryDto en el backend (@Min 10 / @Max 50). */
export const LIMITE_POR_PAGINA = 10

export interface ResultadoExportacion {
  blob: Blob
  nombreArchivo: string
}

const NOMBRE_BASE = 'busqueda-lgi'

const EXTENSION_POR_FORMATO: Record<FormatoExportacion, string> = {
  json: 'json',
  csv: 'csv',
  excel: 'xlsx',
  pdf: 'pdf',
}

export const BusquedaGeneralApi = {
  /** POST /lgi/busqueda-general/buscar */
  async buscar(
    filtros: FiltrosBusquedaLgi,
    paginacion: PaginacionBusquedaLgi
  ): Promise<DatosBuscarLgi> {
    const respuesta = await sesionPeticion<RespuestaBuscarLgi>({
      url: `${BASE}/buscar`,
      method: 'post',
      params: {
        pagina: paginacion.pagina,
        limite: paginacion.limite,
        filtro: paginacion.filtro,
      },
      body: filtros,
      withCredentials: true,
    })

    return {
      total: respuesta.datos?.total ?? 0,
      filas: respuesta.datos?.filas ?? [],
    }
  },

  /** GET /lgi/busqueda-general/catalogos — este endpoint no devuelve `mensaje`. */
  async obtenerCatalogos(): Promise<CatalogosLgi> {
    const respuesta = await sesionPeticion<RespuestaCatalogosLgi>({
      url: `${BASE}/catalogos`,
      method: 'get',
      withCredentials: true,
    })
    return respuesta.datos
  },

  /** GET /lgi/busqueda-general/caso/:casosId/detalle — `casosId` es bigint, se manda como texto. */
  async obtenerDetalle(casosId: string): Promise<DetalleCasoLgi> {
    const respuesta = await sesionPeticion<RespuestaDetalleLgi>({
      url: `${BASE}/caso/${casosId}/detalle`,
      method: 'get',
      withCredentials: true,
    })
    return respuesta.datos
  },

  /**
   * POST /lgi/busqueda-general/export/:formato
   *
   * Con `responseType: 'blob'` un 4xx del backend también llega como Blob con el
   * JSON de error dentro: sin esta comprobación se descargaría un `.xlsx` corrupto.
   */
  async exportar(
    formato: FormatoExportacion,
    filtros: FiltrosBusquedaLgi
  ): Promise<ResultadoExportacion> {
    const blob = await sesionPeticion<Blob>({
      url: `${BASE}/export/${formato}`,
      method: 'post',
      body: filtros,
      responseType: 'blob',
      withCredentials: true,
    })

    if (esRespuestaDeError(blob)) {
      throw new Error(await extraerMensajeDeError(blob))
    }

    return {
      blob,
      nombreArchivo: `${NOMBRE_BASE}.${EXTENSION_POR_FORMATO[formato]}`,
    }
  },
}

/** Los errores del backend con responseType blob llegan como `application/json`. */
function esRespuestaDeError(blob: Blob): boolean {
  return blob.type === 'application/json' || blob.type.includes('json')
}

async function extraerMensajeDeError(blob: Blob): Promise<string> {
  try {
    const texto = await blob.text()
    const datos = JSON.parse(texto) as
      | string
      | { message?: string; mensaje?: string; error?: string }
    if (typeof datos === 'string') return datos
    return (
      datos.message ??
      datos.mensaje ??
      datos.error ??
      'No se pudo generar el archivo de exportación.'
    )
  } catch {
    return 'No se pudo generar el archivo de exportación.'
  }
}
