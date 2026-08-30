/**
 * Interfaces para los filtros y la respuesta de las consultas cruzadas.
 * Cada interfaz de filtro corresponde a un botón del formulario legacy SEG-CAS-04.aspx.cs.
 */

/** Rango de fechas compartido por los filtros que requieren periodo. */
export interface FiltroPorFecha {
  /** Fecha de inicio en formato YYYY-MM-DD */
  fechaInicio: string
  /** Fecha de fin en formato YYYY-MM-DD */
  fechaFin: string
}

/** Filtro por número de caso (búsqueda parcial). Origen: btncaso_Click */
export interface FiltroPorCaso {
  numeroCaso: string
}

/** Filtro por tipo de droga + rango de fechas. Origen: tntipodroga_Click */
export interface FiltroPorTipoDroga extends FiltroPorFecha {
  idTipoDroga: number
}

/** Filtro por estado de droga + rango de fechas. Origen: btnestadroga_Click */
export interface FiltroPorEstadoDroga extends FiltroPorFecha {
  idEstadoDroga: number
}

/** Filtro por tipo de operativo + rango de fechas. Origen: btntipooper_Click */
export interface FiltroPorTipoOperativo extends FiltroPorFecha {
  idTipoOperacion: number
}

/** Filtro por tipo de relevancia + rango de fechas. Origen: btnrelev_Click */
export interface FiltroPorRelevancia extends FiltroPorFecha {
  idTipoRelevancia: number
}

/** Filtro por nombre de persona (aprehendido o arrestado). Origen: btnaprehen_Click / btnarrestado_Click */
export interface FiltroPorPersona {
  nombres?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  apellidoEsposo?: string
}

/**
 * Fila de resultado de cualquier consulta cruzada (op1–op16).
 * Equivale a las columnas alias del SELECT de SEG-CAS-04.aspx.cs.
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
