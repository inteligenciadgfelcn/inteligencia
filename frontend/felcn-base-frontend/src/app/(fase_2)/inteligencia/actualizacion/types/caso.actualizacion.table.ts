export interface CasoActualizacionTable {
  idAsignacion: number
  codigoServicio: string
  numeroOperativo: string
  numeroCaso?: string
  nombreCaso: string
  /// Example: 2025-12-05T20:00:00.000Z
  fechaOperativo: string
  departamento: string
  unidad: string
  asignacionCaso: string
  fiscalAsignado: string

  abreviaturaDepartamento: string
}

// {
//         "idAsignacion": "23",
//         "codigoServicio": "ICIA-1818032026",
//         "numeroOperativo": "CH-CC-18/26",
//         "numeroCaso": null,
//         "nombreCaso": "Operativo Antinarcóticos",
//         "fechaOperativo": "2025-12-05T20:00:00.000Z",
//         "departamento": "CHUQUISACA",
//         "unidad": "Unidad Movil de Patrullaje Rural",
//         "asignacionCaso": "Juan Marquez",
//         "fiscalAsignado": "Dra. María López"
//       }
