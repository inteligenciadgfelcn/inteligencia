import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

const BASE = `${Constantes.baseUrl}/reportes/cruzadas`

/**
 * Columnas que devuelve cada fila del resultado cruzado (op1–op16).
 * Origen: SEG-CAS-04.aspx.cs — SELECT compartido por los 8 filtros.
 */
export interface ResultadoCruzada {
  idOperativo: string
  numeroOperativo: string
  numeroCaso: string
  nombreCaso: string
  asignadoCaso: string
  fechaOperativo: string
  ubicacionGeografica: string
  ubicacionInstitucional: string
  totalHojaCoca: string
  drogasDecomisadas: string
  sustanciasSolidas: string
  sustanciasLiquidas: string
  laboratoriosFabricas: string
  arrestados: string
  personasImplicadas: string
  bienesIncautados: string
}

export interface RespuestaCruzada {
  finalizado: boolean
  mensaje?: string
  datos: ResultadoCruzada[] | { filas: ResultadoCruzada[]; total: number }
  total?: number
}

/** Extrae las filas del formato de respuesta flexible del backend. */
export function extraerFilas(res: RespuestaCruzada): ResultadoCruzada[] {
  if (Array.isArray(res.datos)) return res.datos
  return (res.datos as { filas: ResultadoCruzada[] }).filas ?? []
}

export const CruzadasService = {
  /** Busca operativos en un rango de fechas. Origen: btnfecha_Click */
  porFecha(params: { fechaInicio: string; fechaFin: string }) {
    return sesionPeticion<RespuestaCruzada>({
      url: `${BASE}/por-fecha`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Busca operativos por número de caso (parcial). Origen: btncaso_Click */
  porCaso(params: { numeroCaso: string }) {
    return sesionPeticion<RespuestaCruzada>({
      url: `${BASE}/por-caso`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Busca operativos por tipo de droga + fechas. Origen: tntipodroga_Click */
  porTipoDroga(params: { idTipoDroga: number; fechaInicio: string; fechaFin: string }) {
    return sesionPeticion<RespuestaCruzada>({
      url: `${BASE}/por-tipo-droga`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Busca operativos por estado de droga + fechas. Origen: btnestadroga_Click */
  porEstadoDroga(params: { idEstadoDroga: number; fechaInicio: string; fechaFin: string }) {
    return sesionPeticion<RespuestaCruzada>({
      url: `${BASE}/por-estado-droga`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Busca operativos por tipo de operación + fechas. Origen: btntipooper_Click */
  porTipoOperativo(params: { idTipoOperacion: number; fechaInicio: string; fechaFin: string }) {
    return sesionPeticion<RespuestaCruzada>({
      url: `${BASE}/por-tipo-operativo`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Busca operativos por tipo de relevancia + fechas. Origen: btnrelev_Click */
  porRelevancia(params: { idTipoRelevancia: number; fechaInicio: string; fechaFin: string }) {
    return sesionPeticion<RespuestaCruzada>({
      url: `${BASE}/por-relevancia`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Busca operativos por nombre de persona aprehendida (detenida). Origen: btnaprehen_Click */
  porAprehendido(params: {
    nombres?: string
    apellidoPaterno?: string
    apellidoMaterno?: string
    apellidoEsposo?: string
  }) {
    return sesionPeticion<RespuestaCruzada>({
      url: `${BASE}/por-aprehendido`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Busca operativos por nombre de persona arrestada. Origen: btnarrestado_Click */
  porArrestado(params: {
    nombres?: string
    apellidoPaterno?: string
    apellidoMaterno?: string
    apellidoEsposo?: string
  }) {
    return sesionPeticion<RespuestaCruzada>({
      url: `${BASE}/por-arrestado`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },
}
