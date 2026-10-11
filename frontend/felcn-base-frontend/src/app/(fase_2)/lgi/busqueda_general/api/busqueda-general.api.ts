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
   * No se discrimina el resultado por content-type: el export JSON también es
   * `application/json`. El status HTTP ya lo resuelve `validateStatus` (Servicios.ts),
   * así que un Blob devuelto es un archivo válido y cualquier error llega por throw.
   */
  async exportar(
    formato: FormatoExportacion,
    filtros: FiltrosBusquedaLgi
  ): Promise<ResultadoExportacion> {
    const nombrePorDefecto = `${NOMBRE_BASE}.${EXTENSION_POR_FORMATO[formato]}`
    let nombreArchivo = nombrePorDefecto
    let blob: Blob

    try {
      blob = await sesionPeticion<Blob>({
        url: `${BASE}/export/${formato}`,
        method: 'post',
        body: filtros,
        responseType: 'blob',
        withCredentials: true,
        onRespuesta: (respuesta) => {
          nombreArchivo =
            leerNombreArchivo(respuesta.headers) ?? nombrePorDefecto
        },
      })
    } catch (e) {
      throw new Error(await mensajeDeErrorExportacion(e))
    }

    if (blob.size === 0) {
      throw new Error('El backend devolvió un archivo vacío.')
    }

    return { blob, nombreArchivo }
  },
}

/** Nombre que propone el backend en `Content-Disposition`, con timestamp incluido. */
function leerNombreArchivo(headers: unknown): string | null {
  const cabecera = headers as Record<string, unknown> | undefined
  const raw =
    cabecera?.['content-disposition'] ?? cabecera?.['Content-Disposition']
  if (typeof raw !== 'string') return null

  const conComillas = raw.match(/filename="([^"]+)"/i)
  const sinComillas = raw.match(/filename=([^;]+)/i)
  const nombre = (conComillas?.[1] ?? sinComillas?.[1])?.trim()
  if (!nombre) return null

  // Sólo el nombre de archivo: descarta cualquier ruta que envíe el backend.
  return nombre.split(/[\\/]/).pop() || null
}

/**
 * Con `responseType: 'blob'`, `sesionPeticion` lanza `e.response.data`, que es un
 * Blob con el JSON de error de NestJS dentro: hay que leerlo para mostrar el mensaje real.
 */
async function mensajeDeErrorExportacion(error: unknown): Promise<string> {
  if (error instanceof Blob) return interpretarMensaje(await error.text())
  if (typeof error === 'string') return interpretarMensaje(error)
  if (error instanceof Error) return error.message
  return 'No se pudo generar el archivo de exportación.'
}

function interpretarMensaje(texto: string): string {
  try {
    const datos = JSON.parse(texto) as {
      message?: string | string[]
      mensaje?: string
      error?: string
    }
    const mensaje = datos.message ?? datos.mensaje ?? datos.error
    // El ValidationPipe de Nest devuelve `message` como string[] en los 400.
    if (Array.isArray(mensaje)) return mensaje.join(' · ')
    if (typeof mensaje === 'string' && mensaje) return mensaje
  } catch {
    // No es JSON: se devuelve el texto plano más abajo.
  }
  // Una página de error HTML de un proxy no le sirve al usuario.
  return texto && !texto.startsWith('<')
    ? texto
    : 'No se pudo generar el archivo de exportación.'
}
