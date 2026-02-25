import { CrearPersonaType } from '@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes'

export interface nuevaPassPeticionType {
  codigo: string
  contrasenaNueva: string
}

export interface nuevaPassFormType {
  newPassword1: string
  newPassword2: string
}

export interface CrearCuentaType {
  // nombres: string
  correoElectronico: string
  newPassword1: string
  newPassword2: string
  persona: CrearPersonaType
}
