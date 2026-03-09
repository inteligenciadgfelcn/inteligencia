export interface ServicioTable {
  idServicio: number
  codigoServicio: string
  usuarioPrincipal: string
  usuarioEmergencia: string
  fechaIngreso: string
  fechaSalida: string
  estado: string
  // TODO: agregar mas adelante
  nombreUsuarioPrincipal: null
  // TODO: agregar mas adelante
  nombreUsuarioEmergencia: null
}
