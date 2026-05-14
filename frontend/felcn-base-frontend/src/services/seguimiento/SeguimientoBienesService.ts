import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

const BASE = `${Constantes.baseUrl}/bienes`

export interface CreateBienSecuestradoPayload {
  fiscal: string
  fechaActoSecuestro: string
  investigador: string
}

export interface CreateBienIncautadoPayload {
  numeroResolucion: string
  fechaResolucion: string
  autoridad: string
}

export interface CreateBienConfiscadoPayload {
  numeroSentenciaJudicial: string
  fechaSentenciaJudicial: string
  autoridad: string
}

export interface CreatePerdidaDominioPayload {
  fiscalia: string
  fechaResolucion: string
  autoridad: string
}

export interface CreateSituacionBienPayload {
  fechaRequerimiento: string
  fiscalRequerimiento: string
  idCalidadBien: number
  fechaEntrega: string
  responsableEntrega: string
  responsableRecepcion: string
  institucion: string
  ubicacion: string
}

export const BienesServiceInstance = {
  listarBienesPorOperativo(idOperativo: string) {
    return sesionPeticion({
      url: `${BASE}/operativo/${idOperativo}`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarSecuestrado(idItemBien: string) {
    return sesionPeticion({
      url: `${BASE}/${idItemBien}/secuestrado`,
      method: 'get',
      withCredentials: true,
    })
  },

  registrarSecuestrado(idItemBien: string, dto: CreateBienSecuestradoPayload) {
    return sesionPeticion({
      url: `${BASE}/${idItemBien}/secuestrado`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  listarIncautado(idItemBien: string) {
    return sesionPeticion({
      url: `${BASE}/${idItemBien}/incautado`,
      method: 'get',
      withCredentials: true,
    })
  },

  registrarIncautado(idItemBien: string, dto: CreateBienIncautadoPayload) {
    return sesionPeticion({
      url: `${BASE}/${idItemBien}/incautado`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  listarConfiscado(idItemBien: string) {
    return sesionPeticion({
      url: `${BASE}/${idItemBien}/confiscado`,
      method: 'get',
      withCredentials: true,
    })
  },

  registrarConfiscado(idItemBien: string, dto: CreateBienConfiscadoPayload) {
    return sesionPeticion({
      url: `${BASE}/${idItemBien}/confiscado`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  listarPerdidaDominio(idItemBien: string) {
    return sesionPeticion({
      url: `${BASE}/${idItemBien}/perdida-dominio`,
      method: 'get',
      withCredentials: true,
    })
  },

  registrarPerdidaDominio(idItemBien: string, dto: CreatePerdidaDominioPayload) {
    return sesionPeticion({
      url: `${BASE}/${idItemBien}/perdida-dominio`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  listarSituacion(idItemBien: string) {
    return sesionPeticion({
      url: `${BASE}/${idItemBien}/situacion`,
      method: 'get',
      withCredentials: true,
    })
  },

  registrarSituacion(idItemBien: string, dto: CreateSituacionBienPayload) {
    return sesionPeticion({
      url: `${BASE}/${idItemBien}/situacion`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  listarArchivos(idCaso: string) {
    return sesionPeticion({
      url: `${BASE}/caso/${idCaso}/archivos`,
      method: 'get',
      withCredentials: true,
    })
  },

  subirArchivo(idCaso: string, file: File, idContenidoBien: string, tipo: string, nombre: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('idContenidoBien', idContenidoBien)
    formData.append('tipo', tipo)
    formData.append('nombre', nombre)
    return sesionPeticion({
      url: `${BASE}/caso/${idCaso}/archivos`,
      method: 'post',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },

  async descargarArchivo(idArchivo: string, nombreArchivo: string) {
    const res = await sesionPeticion({
      url: `${BASE}/archivo/${idArchivo}/descargar`,
      method: 'get',
      responseType: 'blob',
      withCredentials: true,
    })
    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', nombreArchivo)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  eliminarArchivo(idArchivo: string) {
    return sesionPeticion({
      url: `${BASE}/archivo/${idArchivo}`,
      method: 'delete',
      withCredentials: true,
    })
  },
}
