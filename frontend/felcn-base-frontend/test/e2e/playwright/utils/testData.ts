import { readFileSync } from 'fs'

export interface SegipPruebaType {
  ComplementoVisible: number
  NumeroDocumento: string
  Complemento: string
  Nombres: string
  PrimerApellido: string
  SegundoApellido: string
  FechaNacimiento: string
  LugarNacimientoPais: string
  LugarNacimientoDepartamento: string
  LugarNacimientoProvincia: string
  LugarNacimientoLocalidad: string
  Observacion: string
}

export interface CiudadanosPruebaType {
  ci: string
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  telefono: string
  email: string
  fecha_nacimiento: string
}

export function loadSegipData(): SegipPruebaType[] {
  return JSON.parse(readFileSync(process.env.PATH_SEGIP!, 'utf-8'))
}

export function loadCiudadanosData(): CiudadanosPruebaType[] {
  return JSON.parse(readFileSync(process.env.PATH_CIUDADANOS!, 'utf-8'))
}
