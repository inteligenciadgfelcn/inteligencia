/**
 * Interfaces del módulo Cuadros
 * Origen: ReporteServicio.aspx.cs — reporte de servicio por CodServicio.
 *
 * El formulario original carga todo con la misma condición WHERE (CodServicio),
 * por eso se consolida en un único objeto RespuestaCuadro por endpoint.
 */

// ─── Grid principal (MuestraResultados → GridView1) ───────────────────────────

/**
 * Una fila del grid principal.
 * Traducción de los alias op0–op14 del SELECT original a nombres descriptivos.
 */
export interface FilaCuadro {
  /** op0  O.id_operativo */
  idOperativo: string
  /** op1  TO_CHAR(fecha_operativo, 'DD/MM/YYYY') */
  fechaOperativo: string
  /** op2  a.numero_caso */
  numeroCaso: string
  /** op3  uni.descripcion || ' - ' || dis.descripcion || ' - ' || grp.descripcion */
  ubicacionInstitucional: string
  /** op4  dep || ' - ' || prov || ' - ' || loc || ' - ' || lugar */
  ubicacionGeografica: string
  /** op5  asignado_caso || ' - ' || fiscal_asignado_caso */
  asignadoFiscal: string
  /** op6  persona_auxiliar (todos los estados) — STRING_AGG separado por ' | ' */
  personasImplicadas: string
  /** op7  droga + estado_droga + tipo_droga + forma_transporte — STRING_AGG separado por ' | ' */
  drogas: string
  /** op8  sustancia_solida — STRING_AGG separado por ' | ' */
  sustanciasSolidas: string
  /** op9  sustancia_liquida — STRING_AGG separado por ' | ' */
  sustanciasLiquidas: string
  /** op10 fabrica + tipo_fabrica — STRING_AGG separado por ' | ' */
  laboratoriosFabricas: string
  /** op11 item_bien_secuestrado + catalogo_tipo — STRING_AGG separado por ' | ' */
  bienesIncautados: string
  /** op12 parametricas.tipo_operacion.descripcion */
  tipoOperativo: string
  /** op13 parametricas.tipo_relevancia.descripcion */
  tipoRelevancia: string
  /** op14 SUM(costo) de drogas + sust_sol + sust_liq + bienes */
  totalCosto: string
}

// ─── Estadísticas consolidadas ────────────────────────────────────────────────

/**
 * Una "otra droga" del listadrogas (DGDROGA).
 * Excluye Td_Id IN (1, 2, 3, 4, 206) — Cocaína, Clorhidrato, Pasta Base,
 * Marihuana y Morfina/Heroína que tienen sus propias filas de resumen.
 */
export interface OtraDroga {
  /** TIPOSDROGA.Descripcion */
  descripcionTipo: string
  /** ESTADODROGA.Descripcion */
  descripcionEstado: string
  /** SUM(Dg_Cantidad) agrupado por estado */
  cantidad: string
  /** ESTADODROGA.Medida (Gramos / Litros) */
  medida: string
}

/**
 * Totales estadísticos.
 * Consolida los 13 métodos NumXxx + numaprehendidos + numarrestados + listadrogas
 * del formulario original en un único objeto.
 */
export interface ResumenEstadistico {
  /** NumCocaina       — SUM droga.cantidad WHERE estado_droga.id_tipo_droga = 1 */
  cocainaBasePasta: string
  /** NumClorhidrato   — SUM droga.cantidad WHERE estado_droga.id_tipo_droga = 2 */
  clorhidratoCocaina: string
  /** NumMarihuana     — SUM droga.cantidad WHERE id_tipo_droga = 4 AND medida = 'Gramos' */
  marihuanaGramos: string
  /** NumMarihuanaLiq  — SUM droga.cantidad WHERE id_tipo_droga = 4 AND medida = 'Litros' */
  marihuanaLitros: string
  /** NumDrogasLiquidas — SUM droga.cantidad WHERE droga.id_estado_droga = 321 (Litros) */
  drogasLiquidasLitros: string
  /** Calculado: (drogasLiquidasLitros / 26.44) * 1000 */
  drogasLiquidasGramos: string
  /** NumCocainaLiquida — SUM droga.cantidad WHERE droga.id_estado_droga = 5 (Litros) */
  cocainaLiquidaLitros: string
  /** Calculado: (cocainaLiquidaLitros / 10) * 1000 */
  cocainaLiquidaGramos: string
  /** numvSusSol       — SUM sust_sol.cantidad WHERE id_sustancia_solida_descripcion != 52 */
  sustanciasSolidasKg: string
  /** numvSusSolSinDet — SUM sust_sol.cantidad WHERE id_sustancia_solida_descripcion = 52 */
  sustanciasSolidasSinDet: string
  /** numvSusLiq       — SUM sust_liq.cantidad WHERE id_sustancia_liquida_descripcion != 69 */
  sustanciasLiquidasLt: string
  /** numvSusLiqSinDet — SUM sust_liq.cantidad WHERE id_sustancia_liquida_descripcion = 69 */
  sustanciasLiquidasSinDet: string
  /** numaprehendidos  — COUNT persona_auxiliar WHERE estado IN ('Aprehendido','Principal Aprehendido') */
  totalAprehendidos: number
  /** numarrestados    — COUNT persona_auxiliar WHERE estado = 'Arrestado' */
  totalArrestados: number
  /** listadrogas (DGDROGA) — otras drogas excluidas del resumen principal */
  otrasDrogas: OtraDroga[]
}

// ─── Fábricas y coordenadas ───────────────────────────────────────────────────

/**
 * Una fila del grid de fábricas (listaFabricas → DGFP).
 */
export interface ResumenFabrica {
  /** TIPOFABRICA.Tf_Id */
  idTipoFabrica: number
  /** TIPOFABRICA.Descripcion + '(s)' */
  descripcion: string
  /** SUM(FABRICAS.Cantidad) agrupado por tipo */
  totalCantidad: number
}

/**
 * Coordenadas de un operativo para renderizar en mapa (operativos → gvresultados).
 * La URL de Google Maps se construye en el frontend: maps?q={coordX},{coordY}
 */
export interface CoordenadaOp {
  /** o.id_operativo */
  idOperativo: string
  /** a.numero_caso */
  numeroCaso: string
  /** a.numero_operativo */
  numeroOperativo: string
  /** o.coord_x (decimal) */
  coordX: number
  /** o.coord_y (decimal) */
  coordY: number
}

// ─── Respuesta unificada ──────────────────────────────────────────────────────

/**
 * Respuesta completa de cualquier endpoint de cuadros.
 * Equivale a todo lo que el formulario ReporteServicio cargaba para un CodServicio.
 */
export interface RespuestaCuadro {
  /** Filas del grid principal (MuestraResultados / GridView1) */
  filas: FilaCuadro[]
  /** Totales y conteos estadísticos (todos los métodos NumXxx consolidados) */
  resumen: ResumenEstadistico
  /** Grid de fábricas agrupadas por tipo (listaFabricas / DGFP) */
  fabricas: ResumenFabrica[]
  /** Operativos con coordenadas GPS (operativos / gvresultados) */
  coordenadas: CoordenadaOp[]
}

// ─── Tipos de filtro por endpoint ────────────────────────────────────────────

export interface FiltroPorServicio {
  codServicio: string
}

export interface FiltroPorFecha {
  fechaInicio: string
  fechaFin: string
}

export interface FiltroPorTipoDroga {
  idTipoDroga: number
  fechaInicio: string
  fechaFin: string
}

export interface FiltroPorTipoOperativo {
  idTipoOperacion: number
  fechaInicio: string
  fechaFin: string
}

export interface FiltroPorRelevancia {
  idTipoRelevancia: number
  fechaInicio: string
  fechaFin: string
}
