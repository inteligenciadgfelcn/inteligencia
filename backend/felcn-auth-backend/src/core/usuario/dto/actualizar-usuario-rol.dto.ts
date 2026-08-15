import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  CorreoLista,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from '@/common/validation'
import { PersonaDto } from './persona.dto'

export class ActualizarUsuarioRolDto {
  @ApiProperty({ example: PersonaDto })
  @ValidateNested()
  @Type(() => PersonaDto)
  persona?: PersonaDto

  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  @ValidateIf((o) => !o.roles)
  @ApiProperty({ example: 'asdfg123@gmail.com' })
  correoElectronico?: string | null

  @ApiProperty({ example: ['3'] })
  @IsNotEmpty()
  @IsArray()
  @ValidateIf((o) => !o.correoElectronico)
  roles: Array<string>

  @IsOptional()
  @ApiProperty({
    example: { '1': ['5', '6'] },
    required: false,
    description:
      'Mapa idRol -> ids de módulo a excluir para ese rol (deben pertenecer a los recursos del rol). Un rol omitido no modifica sus excepciones existentes.',
  })
  recursosExceptuados?: Record<string, string[]>

  @IsOptional()
  ciudadaniaDigital?: boolean

  @IsOptional()
  @ApiProperty({
    example: false,
    required: false,
    description: 'Habilita el doble factor de autenticación (OTP) para este usuario.',
  })
  otpHabilitado?: boolean

  @IsOptional()
  @ApiProperty({ example: 'CNEL. JUAN PÉREZ MAMANI', required: false })
  nombreApp?: string | null

  @IsOptional()
  @ApiProperty({ example: '71234567', required: false })
  telefonoCelular?: string | null

  @IsOptional()
  @ApiProperty({ example: '2234567', required: false })
  telefonoCorporativo?: string | null

  @IsOptional()
  @ApiProperty({
    example: 1,
    required: false,
    description: 'ID del grado policial/militar',
  })
  idGrado?: number | null

  @IsOptional()
  @ApiProperty({
    example: 1,
    required: false,
    description: 'ID del grupo organizacional',
  })
  idGrupo?: number | null

  @IsOptional()
  @ApiProperty({
    example: 'P-001234',
    required: false,
    description: 'Número de pase del funcionario',
  })
  numeroPase?: string | null
}
