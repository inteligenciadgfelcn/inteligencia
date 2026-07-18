import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { ColorS2i, LookupSimple, RespuestaApi } from './types'

const BASE = `${Constantes.baseUrl}/s2i/lookups`

export const S2iLookupsService = {
  listarContinentes(): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/continentes`, withCredentials: true })
  },

  listarPaises(idContinente?: number): Promise<RespuestaApi<LookupSimple[]>> {
    const params = idContinente ? `?idContinente=${idContinente}` : ''
    return sesionPeticion({ url: `${BASE}/paises${params}`, withCredentials: true })
  },

  listarEstadosCaso(): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/estados-caso`, withCredentials: true })
  },

  listarEtapasInvestigacion(): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/etapas-investigacion`, withCredentials: true })
  },

  listarTiposDelito(): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/tipos-delito`, withCredentials: true })
  },

  listarTiposOrganizacion(): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/tipos-organizacion`, withCredentials: true })
  },

  listarContenidoCaso(): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/contenido-caso`, withCredentials: true })
  },

  listarBienes(): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/bienes`, withCredentials: true })
  },

  listarClases(idBien: number): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/clases/${idBien}`, withCredentials: true })
  },

  listarTipos(idCatalogoClase: number): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/tipos/${idCatalogoClase}`, withCredentials: true })
  },

  listarCaracteristicas(idCatalogoTipo: number): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/caracteristicas/${idCatalogoTipo}`, withCredentials: true })
  },

  listarTiposInvestigacionBien(): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/tipos-investigacion-bien`, withCredentials: true })
  },

  listarTiposActivo(): Promise<RespuestaApi<LookupSimple[]>> {
    return sesionPeticion({ url: `${BASE}/tipos-activo`, withCredentials: true })
  },

  listarColores(): Promise<RespuestaApi<ColorS2i[]>> {
    return sesionPeticion({ url: `${BASE}/colores`, withCredentials: true })
  },
}
