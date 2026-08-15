import { ApiProperty } from '@nestjs/swagger'
import {
  CorreoLista,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from '@/common/validation'
import { PersonaDto } from './persona.dto'
import { Type } from 'class-transformer'

export class CrearUsuarioDto {
  usuario?: string
  estado?: string
  contrasena?: string
  @ApiProperty({ example: '123456@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string
  @ApiProperty()
  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto

  ciudadaniaDigital?: boolean

  @IsOptional()
  @ApiProperty({
    example: false,
    required: false,
    description: 'Habilita el doble factor de autenticación (OTP) para este usuario. Por defecto false.',
  })
  otpHabilitado?: boolean

  @IsNotEmpty()
  @ApiProperty({ example: ['1'] })
  roles: Array<string>
  usuarioCreacion?: string

  @IsOptional()
  @ApiProperty({
    example: { '1': ['5', '6'] },
    required: false,
    description:
      'Mapa idRol -> ids de módulo a excluir para ese rol (deben pertenecer a los recursos del rol). Un rol omitido no modifica sus excepciones existentes.',
  })
  recursosExceptuados?: Record<string, string[]>

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
