import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsBoolean,
  IsOptional,
} from 'class-validator'

export class CreateDetenidoDto {
  @ApiProperty({ example: 1, description: 'ID del operativo' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idOperativo: number

  @ApiProperty({ example: 'FELCN-2026-001', description: 'Número de caso' })
  @IsString()
  @MaxLength(50)
  numeroCaso?: string

  @ApiProperty({ example: 'Juan', description: 'Nombres del detenido' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombres: string

  @ApiProperty({ example: 'Perez', description: 'Apellido paterno' })
  @IsString()
  @MaxLength(150)
  apellidoPaterno?: string

  @ApiProperty({ example: 'Lopez', description: 'Apellido materno' })
  @IsString()
  @MaxLength(150)
  apellidoMaterno?: string

  @ApiProperty({
    example: '',
    description: 'Apellido de esposo si corresponde',
  })
  @IsString()
  @MaxLength(150)
  apellidoEsposo?: string

  @ApiProperty({ example: 1, description: 'ID del país' })
  @Type(() => Number)
  @IsNumber()
  idPais?: number

  @ApiProperty({ example: true, description: 'Indica si es masculino' })
  @IsBoolean()
  esMasculino?: boolean

  @ApiProperty({ example: '25-12-1996', description: 'Fecha de nacimiento' })
  @IsString()
  @MaxLength(20)
  fechaNacimiento?: string

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
    description: 'Dirección del detenido',
  })
  @IsString()
  @IsOptional()
  direccion?: string

  @ApiProperty({ example: 2, description: 'ID del estado civil' })
  @Type(() => Number)
  @IsNumber()
  idEstadoCivil?: number

  @ApiProperty({ example: 'Los pinos', description: 'Fecha de nacimiento' })
  @IsString()
  @MaxLength(20)
  lugarNacimiento?: string

  @ApiProperty({ example: true, description: 'Contrastado con el segip' })
  @IsBoolean()
  contrastadoSegip?: boolean

  @ApiProperty({ example: 'Sin antecedentes', description: 'Observaciones' })
  @IsString()
  @IsOptional()
  observacion?: string

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  tieneTarjeta?: boolean

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  condicionPersona?: boolean

  @ApiProperty({ example: 'base64imagen', description: 'Foto frontal' })
  @IsString()
  fotoFrente?: string

  @ApiProperty({ example: 'base64imagen', description: 'Foto perfil derecho' })
  @IsString()
  fotoPerfilDerecho?: string

  @ApiProperty({
    example: 'base64imagen',
    description: 'Foto perfil izquierdo',
  })
  @IsString()
  fotoPerfilIzquierdo?: string
}
