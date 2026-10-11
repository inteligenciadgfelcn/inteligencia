/**
 * Interfaces de respuesta de los reportes estadísticos LGI.
 * Módulo: reportes-lgi/estadisticas
 *
 * Origen de datos (felcn_lgi):
 *   - public.asignacion              → casos
 *   - public.operativo               → actuaciones/operativos LGI
 *   - public.itembiensecuestrado     → bienes secuestrados
 *   - public.estado / parametricas.etapa / parametricas.tipo_informe
 *   - parametricas.catalogotipo / catalogoclase / bienes (jerarquía de bienes)
 */

// ─── Estado del caso ─────────────────────────────────────────────────────────

export interface ItemEtiqueta {
  id: number
  descripcion: string
  cantidad: number
}

export interface FilaSerieMensual {
  yy: string
  casosIniciados: number
  operativos: number
  conclusivo: number
  sentencia: number
  rechazados: number
}

export interface SeriePorEtapa {
  etapa: string
  data: number[]
}

export interface SerieEstadoCaso {
  meses: string[]
  filas: FilaSerieMensual[]
  porEtapa: SeriePorEtapa[]
}

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
  porEstadoCiclo: {
    estadoId: number
    estado: string
    etapaId: number
    etapa: string
    cantidad: number
  }[]
  porUnidad: ItemEtiqueta[]
  porDistrito: ItemEtiqueta[]
  serie: SerieEstadoCaso
}

// ─── Operativos ──────────────────────────────────────────────────────────────

export interface ItemTipoInforme {
  tipoInformeId: number
  tipoInforme: string
  cantidad: number
}

export interface SerieOperativos {
  meses: string[]
  total: number[]
  allanamientos: number[]
  trabajosDeCampo: number[]
  porEtapa: SeriePorEtapa[]
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
  porTipoInforme: ItemTipoInforme[]
  porEtapa: ItemEtiqueta[]
  porEstadoCiclo: {
    estadoId: number
    estado: string
    etapaId: number
    etapa: string
    cantidad: number
  }[]
  porUnidad: ItemEtiqueta[]
  serie: SerieOperativos
}

// ─── Bienes secuestrados ─────────────────────────────────────────────────────

export interface ItemBienCatalogo {
  bienId: number
  bien: string
  items: number
  cantidad: number
  costo: number
}

export interface ItemCategoriaBien {
  categoria: string
  etiqueta: string
  items: number
  cantidad: number
  costo: number
}

export interface SerieBienes {
  meses: string[]
  porCategoria: {
    categoria: string
    etiqueta: string
    data: number[]
  }[]
}

export interface ResumenBienes {
  kpi: {
    totalItems: number
    cantidadTotal: number
    costoTotal: number
    casosImplicados: number
    operativosImplicados: number
  }
  porCategoria: ItemCategoriaBien[]
  porBienCatalogo: ItemBienCatalogo[]
  serie: SerieBienes
}

// ─── Situación legal de bienes ───────────────────────────────────────────────

export interface ItemTipoSituacionLegal {
  tipoId: number
  tipo: string
  registros: number
  items: number
  cantidad: number
  costo: number
}

export interface SerieSituacionLegalPorTipo {
  tipoId: number
  tipo: string
  cantidad: number[]
}

export interface ResumenSituacionLegal {
  kpi: {
    totalItems: number
    cantidadTotal: number
    costoTotal: number
    casosImplicados: number
    operativosImplicados: number
  }
  porTipoSituacion: ItemTipoSituacionLegal[]
  serie: {
    meses: string[]
    porTipo: SerieSituacionLegalPorTipo[]
  }
}

// ─── Personas investigadas ───────────────────────────────────────────────────

export interface SerieSituacionPersona {
  situacion: string
  data: number[]
}

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
    porSituacion: SerieSituacionPersona[]
  }
}

// ─── Personas jurídicas ──────────────────────────────────────────────────────

export interface ItemTopBeneficiario {
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
  topBeneficiarios: ItemTopBeneficiario[]
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