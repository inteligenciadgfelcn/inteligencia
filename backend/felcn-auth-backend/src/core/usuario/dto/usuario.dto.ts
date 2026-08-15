import { CorreoLista, IsEmail, IsNotEmpty } from '@/common/validation'

export class UsuarioDto {
  usuario?: string

  estado?: string

  contrasena?: string

  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string

  ciudadaniaDigital?: boolean

  otpHabilitado?: boolean

  usuarioCreacion?: string

  nombreApp?: string | null

  telefonoCelular?: string | null

  telefonoCorporativo?: string | null

  idGrado?: number | null

  idGrupo?: number | null

  numeroPase?: string | null
}
