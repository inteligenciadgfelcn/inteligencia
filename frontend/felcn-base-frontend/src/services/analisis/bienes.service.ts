import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  ArchivoS2i,
  BienS2i,
  CaracteristicaBien,
  CreateArchivoPayload,
  CreateBienPayload,
  CreateCaracteristicaPayload,
  CreateLugarGisPayload,
  LookupSimple,
  LugarGis,
  RespuestaApi,
} from './types'

const BASE = `${Constantes.baseUrl}/s2i`

export const BienesS2iService = {
  // ── Bienes ─────────────────────────────────────────────────────────────────

  crear(idCaso: string, payload: CreateBienPayload): Promise<RespuestaApi<BienS2i>> {
    return sesionPeticion({
      url: `${BASE}/casos/${idCaso}/bienes`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listar(idCaso: string): Promise<RespuestaApi<BienS2i[]>> {
    return sesionPeticion({ url: `${BASE}/casos/${idCaso}/bienes`, withCredentials: true })
  },

  eliminar(idItemBien: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/bienes/${idItemBien}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  // ── Características ────────────────────────────────────────────────────────

  listarCaracteristicasDisponibles(idItemBien: string): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/bienes/${idItemBien}/caracteristicas-disponibles`, withCredentials: true })
  },

  crearCaracteristica(idItemBien: string, payload: CreateCaracteristicaPayload): Promise<RespuestaApi<CaracteristicaBien>> {
    return sesionPeticion({
      url: `${BASE}/bienes/${idItemBien}/caracteristicas`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listarCaracteristicas(idItemBien: string): Promise<RespuestaApi<CaracteristicaBien[]>> {
    return sesionPeticion({ url: `${BASE}/bienes/${idItemBien}/caracteristicas`, withCredentials: true })
  },

  eliminarCaracteristica(idCaracteristica: number): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/caracteristicas-bien/${idCaracteristica}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  // ── GIS ────────────────────────────────────────────────────────────────────

  crearLugar(idItemBien: string, payload: CreateLugarGisPayload): Promise<RespuestaApi<LugarGis>> {
    return sesionPeticion({
      url: `${BASE}/bienes/${idItemBien}/lugares-gis`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listarLugares(idItemBien: string): Promise<RespuestaApi<LugarGis[]>> {
    return sesionPeticion({ url: `${BASE}/bienes/${idItemBien}/lugares-gis`, withCredentials: true })
  },

  eliminarLugar(idLugar: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/lugares-gis-bien/${idLugar}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  // ── Archivos ───────────────────────────────────────────────────────────────

  subirArchivo(idItemBien: string, payload: CreateArchivoPayload, archivo: File): Promise<RespuestaApi<ArchivoS2i>> {
    const formData = new FormData()
    formData.append('idContenidoCaso', String(payload.idContenidoCaso))
    formData.append('tipo', payload.tipo)
    formData.append('nombre', payload.nombre)
    formData.append('archivo', archivo)
    return sesionPeticion({
      url: `${BASE}/bienes/${idItemBien}/archivos`,
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },

  listarArchivos(idItemBien: string): Promise<RespuestaApi<ArchivoS2i[]>> {
    return sesionPeticion({ url: `${BASE}/bienes/${idItemBien}/archivos`, withCredentials: true })
  },

  descargarArchivo(idArchivo: string): Promise<Blob> {
    return sesionPeticion<Blob>({
      url: `${BASE}/archivos-bien/${idArchivo}/descargar`,
      responseType: 'blob',
      withCredentials: true,
    })
  },

  eliminarArchivo(idArchivo: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/archivos-bien/${idArchivo}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },
}
