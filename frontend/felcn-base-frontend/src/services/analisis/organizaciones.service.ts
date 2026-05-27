import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type LugarGis, {
  ArchivoS2i,
  CreateArchivoPayload,
  CreateEmpresaPayload,
  CreateLugarGisPayload,
  EmpresaS2i,
  RespuestaApi,
} from './types'

const BASE = `${Constantes.baseUrl}/s2i`

export const OrganizacionesService = {
  // ── Organizaciones ─────────────────────────────────────────────────────────

  crear(idCaso: string, payload: CreateEmpresaPayload): Promise<RespuestaApi<EmpresaS2i>> {
    return sesionPeticion({
      url: `${BASE}/casos/${idCaso}/organizaciones`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listar(idCaso: string): Promise<RespuestaApi<EmpresaS2i[]>> {
    return sesionPeticion({ url: `${BASE}/casos/${idCaso}/organizaciones`, withCredentials: true })
  },

  eliminar(idEmpresa: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/organizaciones/${idEmpresa}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  // ── GIS ────────────────────────────────────────────────────────────────────

  crearLugar(idEmpresa: string, payload: CreateLugarGisPayload): Promise<RespuestaApi<LugarGis>> {
    return sesionPeticion({
      url: `${BASE}/organizaciones/${idEmpresa}/lugares-gis`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listarLugares(idEmpresa: string): Promise<RespuestaApi<LugarGis[]>> {
    return sesionPeticion({ url: `${BASE}/organizaciones/${idEmpresa}/lugares-gis`, withCredentials: true })
  },

  eliminarLugar(idLugar: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/lugares-gis-empresa/${idLugar}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  // ── Archivos ───────────────────────────────────────────────────────────────

  subirArchivo(idEmpresa: string, payload: CreateArchivoPayload, archivo: File): Promise<RespuestaApi<ArchivoS2i>> {
    const formData = new FormData()
    formData.append('idContenidoCaso', String(payload.idContenidoCaso))
    formData.append('tipo', payload.tipo)
    formData.append('nombre', payload.nombre)
    formData.append('archivo', archivo)
    return sesionPeticion({
      url: `${BASE}/organizaciones/${idEmpresa}/archivos`,
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },

  listarArchivos(idEmpresa: string): Promise<RespuestaApi<ArchivoS2i[]>> {
    return sesionPeticion({ url: `${BASE}/organizaciones/${idEmpresa}/archivos`, withCredentials: true })
  },

  descargarArchivo(idArchivo: string): Promise<Blob> {
    return sesionPeticion<Blob>({
      url: `${BASE}/archivos-organizacion/${idArchivo}/descargar`,
      responseType: 'blob',
      withCredentials: true,
    })
  },

  eliminarArchivo(idArchivo: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/archivos-organizacion/${idArchivo}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },
}
