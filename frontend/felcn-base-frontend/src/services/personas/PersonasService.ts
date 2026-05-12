import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

const BASE = `${Constantes.baseUrl}/personas`

export interface CreateSituacionPayload {
  idSituacionLegal: number
  nroResolucion: string
  lugar: string
  fecha: string
  autoridad: string
  fjt: string
}

export interface CreateEtapaProcesoPayload {
  idEstado: number
  nroResolucion: string
  lugar: string
  fecha: string
  autoridad: string
  fjt: string
}

export const PersonasServiceInstance = {
  listarPersonasPorOperativo(idOperativo: string) {
    return sesionPeticion({
      url: `${BASE}/operativo/${idOperativo}`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarSituaciones(idDetenido: string) {
    return sesionPeticion({
      url: `${BASE}/${idDetenido}/situacion`,
      method: 'get',
      withCredentials: true,
    })
  },

  registrarSituacion(idDetenido: string, dto: CreateSituacionPayload) {
    return sesionPeticion({
      url: `${BASE}/${idDetenido}/situacion`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  listarEtapasProceso(idDetenido: string) {
    return sesionPeticion({
      url: `${BASE}/${idDetenido}/etapa-proceso`,
      method: 'get',
      withCredentials: true,
    })
  },

  registrarEtapaProceso(idDetenido: string, dto: CreateEtapaProcesoPayload) {
    return sesionPeticion({
      url: `${BASE}/${idDetenido}/etapa-proceso`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  listarSituacionesLegales() {
    return sesionPeticion({
      url: `${BASE}/lookup/situaciones-legales`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarEtapas() {
    return sesionPeticion({
      url: `${BASE}/lookup/etapas`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarEstadosPorEtapa(idEtapa: number) {
    return sesionPeticion({
      url: `${BASE}/lookup/estados/${idEtapa}`,
      method: 'get',
      withCredentials: true,
    })
  },
}
