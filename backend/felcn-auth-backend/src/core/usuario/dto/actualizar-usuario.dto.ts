import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from '@/common/validation'

export class ActualizarUsuarioDto {
  @ApiProperty()
  @IsOptional()
  estado?: string | null

  @ApiProperty()
  @IsOptional()
  correoElectronico?: string

  @ApiProperty()
  @IsOptional()
  contrasena?: string | null

  @ApiProperty()
  @IsOptional()
  intentos?: number | null

  @ApiProperty()
  @IsOptional()
  fechaBloqueo?: string | null

  @ApiProperty()
  @IsOptional()
  codigoDesbloqueo?: string | null

  @ApiProperty()
  @IsOptional()
  codigoActivacion?: string | null

  @ApiProperty()
  @IsOptional()
  codigoTransaccion?: string | null

  @ApiProperty()
  @IsOptional()
  codigoRecuperacion?: string | null

  @IsOptional()
  ciudadaniaDigital?: boolean | null

  @IsOptional()
  otpHabilitado?: boolean | null

  @ApiProperty()
  @IsOptional()
  urlFoto?: string | null

  @IsOptional()
  nombreApp?: string | null

  @IsOptional()
  telefonoCelular?: string | null

  @IsOptional()
  telefonoCorporativo?: string | null

  @IsOptional()
  idGrado?: number | null

  @IsOptional()
  idGrupo?: number | null

  @IsOptional()
  numeroPase?: string | null

  @IsOptional()
  sesionesRevocadasDesde?: Date | null
}
