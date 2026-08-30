import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsDateString, MaxLength } from 'class-validator'

export class CreateConductorDto {
  @ApiProperty({ description: 'Documento de identidad', example: '1234567' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  documento: string

  @ApiProperty({ description: 'Nombres', example: 'JUAN CARLOS' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(75)
  nombres: string

  @ApiProperty({ description: 'Apellido paterno', example: 'PEREZ' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  paterno: string

  @ApiProperty({ description: 'Apellido materno', example: 'GOMEZ' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  materno: string

  @ApiProperty({ description: 'Apellido de esposo(a)', example: '' })
  @IsString()
  @MaxLength(50)
  esposo: string

  @ApiProperty({ description: 'Sexo (M/F)', example: 'M' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  sexo: string

  @ApiProperty({ description: 'Ocupación', example: 'CHOFER' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  ocupacion: string

  @ApiProperty({
    description: 'Dirección de domicilio',
    example: 'AV. SIEMPRE VIVA #123',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  dir1: string

  @ApiProperty({
    description: 'Dirección secundaria / referencia',
    example: '',
  })
  @IsString()
  dir2: string

  @ApiProperty({ description: 'Departamento de domicilio', example: 'LA PAZ' })
  @IsString()
  @IsNotEmpty()
  nomdep: string

  @ApiProperty({ description: 'Provincia de domicilio', example: 'MURILLO' })
  @IsString()
  @IsNotEmpty()
  nomprov: string

  @ApiProperty({ description: 'Municipio de domicilio', example: 'LA PAZ' })
  @IsString()
  @IsNotEmpty()
  nommun: string

  @ApiProperty({
    description: 'Fecha de nacimiento (ISO)',
    example: '1990-05-20',
  })
  @IsDateString()
  fechanac: string
}
