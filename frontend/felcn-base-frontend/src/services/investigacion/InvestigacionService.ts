import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { RespuestaApi } from '@/services/operativos/types'

const BASE_USUARIO = `${Constantes.baseUrl}/usuarios`
const BASE_INVESTIGACION = `${Constantes.baseUrl}/investigacion`

export interface InvestigadorItem {
  idUsuario?: string
  usuario: string
  nombreCompleto: string
}

export interface AsignacionItem {
  id: string
  unidad: string
  distrital: string
  nroOperativo: string
  nombreCaso: string
  numeroCaso: string
  asignadoCaso: string
  fiscalAsignadoCaso: string
  idDepartamentoCaso: string
  abreviaturaUnidad: string
  idDistrital: number
  idGrupo: number
}

export interface OperativoItem {
  id: string
  nroInforme: string
  fechaOperativo: string
  lugarCompleto: string
  unidadDistrital: string
  relacionHecho: string
}

export interface CasoParaleloItem {
  id: number
  estado: string
  departamento: string
  unidad: string
  distrital: string
  grupo: string
  delito: string
  numeroCaso: string
  asignadoCaso: string
  fiscalAsignadoCaso: string
  delitoPrecedente: string
  informe: string
  fechaEnvio: string
  fechaRespuesta: string | null
}

export interface BuscarAsignacionParams {
  abreviaturaUnidad?: string
  nroCaso?: string
  investigador?: string
  nombreCaso?: string
  nroCasoPerdidaDominio?: string
  nroOperativo?: string
}

interface PagedResponse<T> {
  filas: T[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export interface InvestigacionParalelaPayload {
  idCaso: string
  idDepartamentoCaso: string
  abreviaturaUnidad: string
  idDistrital: number
  idGrupo: number
  delito: string
  numeroCaso: string
  asignadoCaso: string
  fiscalAsignadoCaso: string
  idOperativo: string
  delitoPrecedente: string
  informe: string
  fechaEnvioInvestigacionParalela: string
  resultado: boolean
  fechaRespuestaInvestigacionParalela?: string
  respuestaInvestigacionParalela: boolean
}

export const InvestigacionService = {

  async listarUsuariosUnidad(abreviatura: string): Promise<RespuestaApi<InvestigadorItem[]>> {
    const res = await sesionPeticion<any>({
      url: `${BASE_USUARIO}/unidad/${abreviatura}`,
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

  buscarAsignacion(
    abreviaturaUnidad: string,
    filtros: Omit<BuscarAsignacionParams, 'abreviaturaUnidad'>
  ): Promise<RespuestaApi<AsignacionItem[]>> {
    return sesionPeticion({
      url: `${BASE_INVESTIGACION}/asignacion`,
      method: 'get',
      params: { ...filtros, abreviaturaUnidad },
      withCredentials: true,
    })
  },

  listarOperativosPorCaso(idCaso: string): Promise<RespuestaApi<OperativoItem[]>> {
    return sesionPeticion({
      url: `${BASE_INVESTIGACION}/asignacion/${idCaso}/operativos`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarEnAnalisis(
    abreviaturaUnidad: string,
    pagina = 1,
    limite = 10
  ): Promise<RespuestaApi<PagedResponse<CasoParaleloItem>>> {
    return sesionPeticion({
      url: `${BASE_INVESTIGACION}/en-analisis`,
      method: 'get',
      params: { abreviaturaUnidad, pagina, limite },
      withCredentials: true,
    })
  },

  listarJudicializados(
    abreviaturaUnidad: string,
    pagina = 1,
    limite = 10
  ): Promise<RespuestaApi<PagedResponse<CasoParaleloItem>>> {
    return sesionPeticion({
      url: `${BASE_INVESTIGACION}/judicializados`,
      method: 'get',
      params: { abreviaturaUnidad, pagina, limite },
      withCredentials: true,
    })
  },

  listarDesestimados(
    abreviaturaUnidad: string,
    pagina = 1,
    limite = 10
  ): Promise<RespuestaApi<PagedResponse<CasoParaleloItem>>> {
    return sesionPeticion({
      url: `${BASE_INVESTIGACION}/desestimados`,
      method: 'get',
      params: { abreviaturaUnidad, pagina, limite },
      withCredentials: true,
    })
  },

  guardar(payload: InvestigacionParalelaPayload): Promise<RespuestaApi<any>> {
    return sesionPeticion({
      url: `${BASE_INVESTIGACION}`,
      method: 'post',
      body: payload,
      withCredentials: true,
    })
  },
}
