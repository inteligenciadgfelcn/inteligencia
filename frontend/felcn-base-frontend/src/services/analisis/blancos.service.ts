import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  AntecedenteBlanco,
  ArchivoS2i,
  BlancoS2i,
  CreateAntecedentePayload,
  CreateArchivoPayload,
  CreateBlancoPayload,
  CreateLugarGisPayload,
  CreateRedSocialPayload,
  LugarGis,
  RedSocial,
  RespuestaApi,
} from './types'

const BASE = `${Constantes.baseUrl}/s2i`

export const BlancosService = {
  // ── Blancos ────────────────────────────────────────────────────────────────

  crear(idCaso: string, payload: CreateBlancoPayload): Promise<RespuestaApi<BlancoS2i>> {
    return sesionPeticion({
      url: `${BASE}/casos/${idCaso}/blancos`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listar(idCaso: string): Promise<RespuestaApi<BlancoS2i[]>> {
    return sesionPeticion({ url: `${BASE}/casos/${idCaso}/blancos`, withCredentials: true })
  },

  eliminar(idBlanco: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/blancos/${idBlanco}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  // ── Foto ───────────────────────────────────────────────────────────────────

  actualizarFoto(idBlanco: string, foto: File): Promise<RespuestaApi<unknown>> {
    const formData = new FormData()
    formData.append('foto', foto)
    return sesionPeticion({
      url: `${BASE}/blancos/${idBlanco}/foto`,
      method: 'PATCH',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },

  obtenerFoto(idBlanco: string): Promise<Blob> {
    return sesionPeticion<Blob>({
      url: `${BASE}/blancos/${idBlanco}/foto`,
      responseType: 'blob',
      withCredentials: true,
    })
  },

  // ── Antecedentes ───────────────────────────────────────────────────────────

  crearAntecedente(idBlanco: string, payload: CreateAntecedentePayload): Promise<RespuestaApi<AntecedenteBlanco>> {
    return sesionPeticion({
      url: `${BASE}/blancos/${idBlanco}/antecedentes`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listarAntecedentes(idBlanco: string): Promise<RespuestaApi<AntecedenteBlanco[]>> {
    return sesionPeticion({ url: `${BASE}/blancos/${idBlanco}/antecedentes`, withCredentials: true })
  },

  eliminarAntecedente(idAntecedente: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/antecedentes/${idAntecedente}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  // ── Redes Sociales ─────────────────────────────────────────────────────────

  crearRedSocial(idBlanco: string, payload: CreateRedSocialPayload): Promise<RespuestaApi<RedSocial>> {
    return sesionPeticion({
      url: `${BASE}/blancos/${idBlanco}/redes-sociales`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listarRedesSociales(idBlanco: string): Promise<RespuestaApi<RedSocial[]>> {
    return sesionPeticion({ url: `${BASE}/blancos/${idBlanco}/redes-sociales`, withCredentials: true })
  },

  eliminarRedSocial(idRedSocial: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/redes-sociales/${idRedSocial}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  // ── GIS ────────────────────────────────────────────────────────────────────

  crearLugar(idBlanco: string, payload: CreateLugarGisPayload): Promise<RespuestaApi<LugarGis>> {
    return sesionPeticion({
      url: `${BASE}/blancos/${idBlanco}/lugares-gis`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listarLugares(idBlanco: string): Promise<RespuestaApi<LugarGis[]>> {
    return sesionPeticion({ url: `${BASE}/blancos/${idBlanco}/lugares-gis`, withCredentials: true })
  },

  eliminarLugar(idLugar: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/lugares-gis-blanco/${idLugar}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  // ── Archivos ───────────────────────────────────────────────────────────────

  subirArchivo(idBlanco: string, payload: CreateArchivoPayload, archivo: File): Promise<RespuestaApi<ArchivoS2i>> {
    const formData = new FormData()
    formData.append('idContenidoCaso', String(payload.idContenidoCaso))
    formData.append('tipo', payload.tipo)
    formData.append('nombre', payload.nombre)
    formData.append('archivo', archivo)
    return sesionPeticion({
      url: `${BASE}/blancos/${idBlanco}/archivos`,
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },

  listarArchivos(idBlanco: string): Promise<RespuestaApi<ArchivoS2i[]>> {
    return sesionPeticion({ url: `${BASE}/blancos/${idBlanco}/archivos`, withCredentials: true })
  },

  descargarArchivo(idArchivo: string): Promise<Blob> {
    return sesionPeticion<Blob>({
      url: `${BASE}/archivos-blanco/${idArchivo}/descargar`,
      responseType: 'blob',
      withCredentials: true,
    })
  },

  eliminarArchivo(idArchivo: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/archivos-blanco/${idArchivo}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },
}
