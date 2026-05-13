import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

const BASE = `${Constantes.baseUrl}/seguimiento`
const BASE_USUARIO = `${Constantes.baseUrl}/usuarios`

export interface SeguimientoDetalle {
  operativos: any[]
  fiscales: any[]
  jurisdicciones: any[]
  controles: any[]
  archivos: any[]
}

export interface UpdateMetadatosPayload {
  ianus?: string
  numeroCasoPerDom?: string
  idEtapaInvestigacion?: number
  descripcionOperativo?: string
}

export interface FiscalPayload {
  nombreApellidos: string
  telefonoCelular: string
  telefonoFijo: string
  fecha: string
}

export interface JurisdiccionPayload {
  jurisdiccion: string
  observacion: string
  fecha: string
}

export interface ControlJurisdiccionalPayload {
  juzgadoInstruccion: string
  juzgadoPartido: string
  tribunalSentencia: string
  juzgadoEjecucion: string
  fecha: string
}

export interface ServidorPolicialPayload {
  idGrado: number
  nombreApellidos: string
}

export const SeguimientoServiceInstance = {
  obtenerDetalle(idCaso: string) {
    return sesionPeticion({
      url: `${BASE}/detalle/${idCaso}`,
      method: 'get',
      withCredentials: true,
    })
  },

  actualizarMetadatos(idCaso: string, idOperativo: string, dto: UpdateMetadatosPayload) {
    return sesionPeticion({
      url: `${BASE}/metadatos/${idCaso}/${idOperativo}`,
      method: 'patch',
      body: dto,
      withCredentials: true,
    })
  },

  agregarFiscal(idCaso: string, dto: FiscalPayload) {
    return sesionPeticion({
      url: `${BASE}/fiscal/${idCaso}`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  agregarJurisdiccion(idCaso: string, dto: JurisdiccionPayload) {
    return sesionPeticion({
      url: `${BASE}/jurisdiccion/${idCaso}`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  agregarControlJurisdiccional(idCaso: string, dto: ControlJurisdiccionalPayload) {
    return sesionPeticion({
      url: `${BASE}/control-jurisdiccional/${idCaso}`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  listarServidores(idOperativo: string) {
    return sesionPeticion({
      url: `${BASE}/servidor-policial/${idOperativo}`,
      method: 'get',
      withCredentials: true,
    })
  },

  agregarServidor(idOperativo: string, dto: ServidorPolicialPayload) {
    return sesionPeticion({
      url: `${BASE}/servidor-policial/${idOperativo}`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  subirArchivo(idCaso: string, file: File, idContenidoCaso: string, tipo: string, nombre: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('idContenidoCaso', idContenidoCaso)
    formData.append('tipo', tipo)
    formData.append('nombre', nombre)

    return sesionPeticion({
      url: `${BASE}/archivo/${idCaso}`,
      method: 'post',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },

  eliminarArchivo(idArchivo: string) {
    return sesionPeticion({
      url: `${BASE}/archivo/${idArchivo}`,
      method: 'delete',
      withCredentials: true,
    })
  },

  agregarInvestigador(idCaso: string, dto: any) {
    return sesionPeticion({
      url: `${BASE}/investigador/${idCaso}`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  async descargarArchivo(idArchivo: string, nombreArchivo: string) {
    const res = await sesionPeticion({
      url: `${BASE}/archivo/descargar/${idArchivo}`,
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

  async cargarGrados() {
    const res = await sesionPeticion<any>({
      url: `${BASE_USUARIO}/grados`,
      method: 'get',
      withCredentials: true,
    })

    // Si la respuesta es un array directo (backend base v2), lo envolvemos en RespuestaApi
    if (Array.isArray(res)) {
      return {
        finalizado: true,
        mensaje: 'ok',
        datos: res,
      }
    }
    return res
  },
}
