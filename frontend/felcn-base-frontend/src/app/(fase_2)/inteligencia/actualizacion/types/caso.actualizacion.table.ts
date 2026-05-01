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
  idOperativo: number
  idCaso: number
}

// {
//         "idAsignacion": "61",
//         "codigoServicio": "ICIA-2222042026",
//         "numeroOperativo": "LP-UFLCN-LP-6/26",
//         "numeroCaso": null,
//         "nombreCaso": "PRUEBA 1",
//         "fechaOperativo": "2026-03-23T09:00:00.000Z",
//         "abreviaturaDepartamento": "LP",
//         "departamento": "La Paz",
//         "unidad": "GRUPO ESPECIAL DE CONTROL DE COCA",
//         "asignacionCaso": "CAP. JUAN PEREZ CARDENAS",
//         "fiscalAsignado": "JUAN PEREZ",
//         "idOperativo": "25",
//         "existe": true
//       }
