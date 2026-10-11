export type DatosPrincipalesReporte = Record<string, any>

export function obtenerSeccionEncabezado(datos: DatosPrincipalesReporte) {
  return {
    opId: datos.opId,
    casosId: String(datos.casosId),
    numeroReporte: datos.numeroReporte,
    fechaInforme: datos.fechaInforme,
    fechaCreacionActuacion: datos.fechaCreacionActuacion,
    idTipoInforme: datos.idTipoInforme,
    otroInforme: datos.otroInforme,
    numeroActuacion: datos.numeroActuacion,
    gestionActuacion: datos.gestionActuacion,
  }
}

export function obtenerSeccionDependencia(datos: DatosPrincipalesReporte) {
  return {
    disId: datos.disId,
    regional: datos.regional,
    divisionRegional: datos.divisionRegional,
    idUnidad: datos.idUnidad,
    unidad: datos.unidad,
    unidadAbreviada: datos.unidadAbreviada,
    idGrupo: datos.idGrupo,
    descripcionGrupo: datos.descripcionGrupo,
    puesto: datos.puesto,
  }
}

export function obtenerSeccionResponsables(
  datos: DatosPrincipalesReporte
) {
  return {
    investigadores: (datos.investigadores ?? []) as string[],
    fiscalAsignado: datos.fiscalAsignado ?? null,
    controlJurisdiccional:
      datos.controlJurisdiccional ?? null,
  }
}


export function obtenerSeccionActuacion(datos: DatosPrincipalesReporte) {
  return {
    dptoId: datos.dptoId,
    lugarInvestigacion: datos.lugarInvestigacion,
    sintesis: datos.sintesis,
  }
}

export function obtenerSeccionEtapaProcesal(datos: DatosPrincipalesReporte) {
  return {
    idEtapa: datos.idEtapa,
    etapaDescripcion: datos.etapaDescripcion,
    idEstado: datos.idEstado,
    fechaRecepcionFiscalia: datos.fechaRecepcionFiscalia,
    diasOtorgados: datos.diasOtorgados,
  }
}

export function obtenerSeccionConclusiones(datos: DatosPrincipalesReporte) {
  return {
    tipologiasIdentificadas: datos.tipologiasIdentificadas,
    verbosRectores: datos.verbosRectores,
    etapasCicloLgi: datos.etapasCicloLgi,
  }
}

export function obtenerSeccionDatosCaso(datos: DatosPrincipalesReporte) {
  return {
    casosId: String(datos.casosId),
    nombreCaso: datos.nombreCaso ?? null,
    fechaInicio: datos.fechaInicio ?? null,
    numeroCaso: datos.numeroCaso ?? null,
    numeroCasoFiscalia: datos.numeroCasoFiscalia ?? null,
    numeroCasoGiaef: datos.numeroCasoGiaef ?? null,
    cudIfp: datos.cudIfp ?? null,
    ianus: datos.ianus ?? null,
    perdidaDominio: datos.perdidaDominio ?? false,
    numeroCasoPerdidaDominio: datos.numeroCasoPerdidaDominio ?? null,
    formaInicio: datos.formaInicio ?? null,
    controlJurisdiccional: datos.controlJurisdiccional ?? null,
  }
}
