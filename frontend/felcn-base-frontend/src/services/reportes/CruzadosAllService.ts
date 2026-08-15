import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { ResumenEstadistico, ResumenFabrica } from './CuadrosService'

const BASE = `${Constantes.baseUrl}/reportes/cruzadas`

// ─── Tipos de resultado ───────────────────────────────────────────────────────

export interface ResultadoAvanzado {
  idOperativo: string
  fechaOperativo: string
  numeroCaso: string
  numeroOperativo: string
  numeroInforme: string
  ubicacionInstitucional: string
  ubicacionGeografica: string
  nombreCaso: string
  ianus: string
  fiscalSolicitud: string
  asignado: string
  asignadoFiscal: string
  tipoOperativo: string
  tipoRelevancia: string
  colorRelevancia: string
  categoriaOperativo: string
  planOperacion: string
  tipoDenuncia: string | null
  tipoPenal: string | null
  organizacion: string
  alMandoDe: string
  clanFamiliar: string | null
  esPositivo: boolean
  esAprehendido: boolean
  esArrestado: boolean
  esIcia: boolean
  esParteDiario: boolean
  esRevisado: boolean
  coordX: number | null
  coordY: number | null
  personasImplicadas: string
  drogas: string
  sustanciasSolidas: string
  sustanciasLiquidas: string
  laboratoriosFabricas: string
  bienesIncautados: string
  totalCosto: string
}

// ─── Parámetros del endpoint /avanzado ───────────────────────────────────────

export interface FiltrosAvanzadosParams {
  codigoServicio?: string
  fechaInicio?: string
  fechaFin?: string
  numeroCaso?: string
  fiscal?: string
  nombreCaso?: string
  numeroOperativo?: string
  ianus?: string
  fiscalSolicitud?: string
  asignadoCaso?: string
  idTipoDroga?: string
  idTipoOperacion?: string
  idTipoRelevancia?: string
  idUnidad?: string
  idPlanOperacion?: string
  organizacion?: string
  idTipoDenuncia?: string
  idTipoPenal?: string
  idCategoriaOperativo?: string
  idDepartamento?: string
  idProvincia?: string
  idLocalidad?: string
  lugar?: string
  idBien?: string
  idCatalogoClase?: string
  esPositivo?: string
  esAprehendido?: string
  esArrestado?: string
  esIcia?: string
  esParteDiario?: string
  esRevisado?: string
  idEstadoDroga?: string
  idPaisProcedencia?: string
  idPaisDestino?: string
  costoDrogaMin?: string
  costoDrogaMax?: string
  nombresPersona?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  nroDocumento?: string
  idPaisPersona?: string
}

export interface RespuestaAvanzada {
  finalizado: boolean
  mensaje?: string
  datos: {
    filas: ResultadoAvanzado[]
    resumen: ResumenEstadistico
    fabricas: ResumenFabrica[]
  }
}

export { type ResumenEstadistico, type ResumenFabrica }

export function extraerFilasAvanzadas(res: RespuestaAvanzada): ResultadoAvanzado[] {
  return res.datos.filas ?? []
}

export function extraerResumen(res: RespuestaAvanzada): ResumenEstadistico | null {
  return res.datos.resumen ?? null
}

export function extraerFabricas(res: RespuestaAvanzada): ResumenFabrica[] {
  return res.datos.fabricas ?? []
}

export const CruzadosAllService = {
  avanzado(params: FiltrosAvanzadosParams) {
    const limpio = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    )
    return sesionPeticion<RespuestaAvanzada>({
      url: `${BASE}/avanzado`,
      method: 'get',
      params: limpio,
      withCredentials: true,
    })
  },
}
