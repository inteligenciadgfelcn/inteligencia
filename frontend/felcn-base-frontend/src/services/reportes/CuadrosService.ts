import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

const BASE = `${Constantes.baseUrl}/reportes/cuadros`

// ─── Interfaces de respuesta (espejo del backend cuadro-filtro.interface.ts) ──

export interface FilaCuadro {
  idOperativo: string
  fechaOperativo: string
  numeroCaso: string
  ubicacionInstitucional: string
  ubicacionGeografica: string
  asignadoFiscal: string
  personasImplicadas: string
  drogas: string
  sustanciasSolidas: string
  sustanciasLiquidas: string
  laboratoriosFabricas: string
  bienesIncautados: string
  tipoOperativo: string
  tipoRelevancia: string
  totalCosto: string
}

export interface OtraDroga {
  descripcionTipo: string
  descripcionEstado: string
  cantidad: string
  medida: string
}

export interface ResumenEstadistico {
  cocainaBasePasta: string
  clorhidratoCocaina: string
  marihuanaGramos: string
  marihuanaLitros: string
  drogasLiquidasLitros: string
  drogasLiquidasGramos: string
  cocainaLiquidaLitros: string
  cocainaLiquidaGramos: string
  sustanciasSolidasKg: string
  sustanciasSolidasSinDet: string
  sustanciasLiquidasLt: string
  sustanciasLiquidasSinDet: string
  totalAprehendidos: number
  totalArrestados: number
  otrasDrogas: OtraDroga[]
}

export interface ResumenFabrica {
  idTipoFabrica: number
  descripcion: string
  totalCantidad: number
}

export interface CoordenadaOp {
  idOperativo: string
  numeroCaso: string
  numeroOperativo: string
  coordX: number
  coordY: number
}

export interface RespuestaCuadro {
  filas: FilaCuadro[]
  resumen: ResumenEstadistico
  fabricas: ResumenFabrica[]
  coordenadas: CoordenadaOp[]
}

export interface RespuestaAPICuadro {
  finalizado: boolean
  mensaje?: string
  datos: RespuestaCuadro
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const CuadrosService = {
  /** Reporte por código de servicio. Origen: ReporteServicio.aspx?id=... */
  porServicio(params: { codServicio: string }) {
    return sesionPeticion<RespuestaAPICuadro>({
      url: `${BASE}/por-servicio`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Reporte por rango de fechas. */
  porFecha(params: { fechaInicio: string; fechaFin: string }) {
    return sesionPeticion<RespuestaAPICuadro>({
      url: `${BASE}/por-fecha`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Reporte de operativos que contienen drogas del tipo indicado. */
  porTipoDroga(params: { idTipoDroga: number; fechaInicio: string; fechaFin: string }) {
    return sesionPeticion<RespuestaAPICuadro>({
      url: `${BASE}/por-tipo-droga`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Reporte por tipo de operación. */
  porTipoOperativo(params: { idTipoOperacion: number; fechaInicio: string; fechaFin: string }) {
    return sesionPeticion<RespuestaAPICuadro>({
      url: `${BASE}/por-tipo-operativo`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Reporte por tipo de relevancia. */
  porRelevancia(params: { idTipoRelevancia: number; fechaInicio: string; fechaFin: string }) {
    return sesionPeticion<RespuestaAPICuadro>({
      url: `${BASE}/por-relevancia`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  /** Reporte por nombre de persona implicada. */
  porPersona(params: {
    nombres?: string
    apellidoPaterno?: string
    apellidoMaterno?: string
    apellidoEsposo?: string
  }) {
    return sesionPeticion<RespuestaAPICuadro>({
      url: `${BASE}/por-persona`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },
}
