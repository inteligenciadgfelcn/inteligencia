import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

const BASE = `${Constantes.baseUrl}/reportes-lgi/estadisticas`

// ─── Tipos compartidos ───────────────────────────────────────────────────────

export interface ItemEtiqueta {
  id: number
  descripcion: string
  cantidad: number
}

export interface EstadoCicloRow {
  estadoId: number
  estado: string
  etapaId: number
  etapa: string
  cantidad: number
}

export interface SeriePorEtapa {
  etapa: string
  data: number[]
}

// ─── Estado del caso ─────────────────────────────────────────────────────────

export interface ResumenEstadoCaso {
  kpi: {
    casosIniciados: number
    conInformeConclusivo: number
    conSentencia: number
    rechazados: number
    apd: number
    totalOperativos: number
    tiempoPromedioDias: number
  }
  porEtapaActual: ItemEtiqueta[]
  porEstadoCiclo: EstadoCicloRow[]
  porUnidad: ItemEtiqueta[]
  porDistrito: ItemEtiqueta[]
  serie: {
    meses: string[]
    filas: {
      yy: string
      casosIniciados: number
      operativos: number
      conclusivo: number
      sentencia: number
      rechazados: number
    }[]
    porEtapa: SeriePorEtapa[]
  }
}

// ─── Operativos ──────────────────────────────────────────────────────────────

export interface TipoInformeRow {
  tipoInformeId: number
  tipoInforme: string
  cantidad: number
}

export interface ResumenOperativos {
  kpi: {
    totalOperativos: number
    allanamientos: number
    solicitudesAllanamiento: number
    trabajosDeCampo: number
    promedioDiasOtorgados: number
    casosImplicados: number
  }
  porTipoInforme: TipoInformeRow[]
  porEtapa: ItemEtiqueta[]
  porEstadoCiclo: EstadoCicloRow[]
  porUnidad: ItemEtiqueta[]
  serie: {
    meses: string[]
    total: number[]
    allanamientos: number[]
    trabajosDeCampo: number[]
    porEtapa: SeriePorEtapa[]
  }
}

// ─── Bienes secuestrados ─────────────────────────────────────────────────────

export interface CategoriaBienRow {
  categoria: string
  etiqueta: string
  items: number
  cantidad: number
  costo: number
}

export interface BienCatalogoRow {
  bienId: number
  bien: string
  items: number
  cantidad: number
  costo: number
}

export interface ResumenBienes {
  kpi: {
    totalItems: number
    cantidadTotal: number
    costoTotal: number
    casosImplicados: number
    operativosImplicados: number
  }
  porCategoria: CategoriaBienRow[]
  porBienCatalogo: BienCatalogoRow[]
  serie: {
    meses: string[]
    porCategoria: {
      categoria: string
      etiqueta: string
      data: number[]
    }[]
  }
}

// ─── Situación legal de bienes ───────────────────────────────────────────────

export interface TipoSituacionLegalRow {
  tipoId: number
  tipo: string
  registros: number
  items: number
  cantidad: number
  costo: number
}

export interface ResumenSituacionLegal {
  kpi: {
    totalItems: number
    cantidadTotal: number
    costoTotal: number
    casosImplicados: number
    operativosImplicados: number
  }
  porTipoSituacion: TipoSituacionLegalRow[]
  serie: {
    meses: string[]
    porTipo: {
      tipoId: number
      tipo: string
      cantidad: number[]
    }[]
  }
}

// ─── Personas investigadas ───────────────────────────────────────────────────

export interface ResumenPersonasInvestigadas {
  kpi: {
    totalPersonas: number
    casosImplicados: number
    conSituacionJuridica: number
    sinSituacionJuridica: number
  }
  porSituacionLegal: ItemEtiqueta[]
  serie: {
    meses: string[]
    porSituacion: {
      situacion: string
      data: number[]
    }[]
  }
}

// ─── Personas jurídicas ──────────────────────────────────────────────────────

export interface TopBeneficiarioRow {
  empresa: string
  beneficiarios: number
}

export interface ResumenPersonasJuridicas {
  kpi: {
    totalEmpresas: number
    identificadasIntervenidas: number
    casosImplicados: number
    totalBeneficiarios: number
  }
  porTipoSociedad: ItemEtiqueta[]
  porSituacionJuridica: ItemEtiqueta[]
  porVinculo: ItemEtiqueta[]
  topBeneficiarios: TopBeneficiarioRow[]
  serie: {
    meses: string[]
    total: number[]
  }
}

// ─── Otros datos (tipologías, verbos rectores, etapas/ciclo) ─────────────────

export interface ResumenOtrosDatos {
  kpi: {
    totalOperativos: number
    conTipologia: number
    conVerboRector: number
    conEtapaCiclo: number
  }
  porTipologia: ItemEtiqueta[]
  porVerboRector: ItemEtiqueta[]
  porEtapaCiclo: ItemEtiqueta[]
}

// ─── Respuesta API ───────────────────────────────────────────────────────────

interface RespuestaApi<T> {
  finalizado: boolean
  mensaje: string
  datos: T
}

export interface FiltrosEstadisticosLgi {
  fechaInicio?: string
  fechaFin?: string
  gestion?: number
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const LgiEstadisticasService = {
  estadoCaso(filtros: FiltrosEstadisticosLgi) {
    return sesionPeticion<RespuestaApi<ResumenEstadoCaso>>({
      url: `${BASE}/estado-caso`,
      method: 'get',
      params: filtros,
      withCredentials: true,
    })
  },

  operativos(filtros: FiltrosEstadisticosLgi) {
    return sesionPeticion<RespuestaApi<ResumenOperativos>>({
      url: `${BASE}/operativos`,
      method: 'get',
      params: filtros,
      withCredentials: true,
    })
  },

  bienes(filtros: FiltrosEstadisticosLgi) {
    return sesionPeticion<RespuestaApi<ResumenBienes>>({
      url: `${BASE}/bienes`,
      method: 'get',
      params: filtros,
      withCredentials: true,
    })
  },

  situacionLegal(filtros: FiltrosEstadisticosLgi) {
    return sesionPeticion<RespuestaApi<ResumenSituacionLegal>>({
      url: `${BASE}/situacion-legal`,
      method: 'get',
      params: filtros,
      withCredentials: true,
    })
  },

  personasInvestigadas(filtros: FiltrosEstadisticosLgi) {
    return sesionPeticion<RespuestaApi<ResumenPersonasInvestigadas>>({
      url: `${BASE}/personas-investigadas`,
      method: 'get',
      params: filtros,
      withCredentials: true,
    })
  },

  personasJuridicas(filtros: FiltrosEstadisticosLgi) {
    return sesionPeticion<RespuestaApi<ResumenPersonasJuridicas>>({
      url: `${BASE}/personas-juridicas`,
      method: 'get',
      params: filtros,
      withCredentials: true,
    })
  },

  otrosDatos(filtros: FiltrosEstadisticosLgi) {
    return sesionPeticion<RespuestaApi<ResumenOtrosDatos>>({
      url: `${BASE}/otros-datos`,
      method: 'get',
      params: filtros,
      withCredentials: true,
    })
  },
}