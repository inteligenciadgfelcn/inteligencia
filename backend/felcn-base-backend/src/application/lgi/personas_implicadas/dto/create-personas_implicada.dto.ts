import { Type } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreatePersonaImplicadaDto {
  @ApiProperty({
    description: 'Identificador del caso',
    example: 100,
  })
  @Type(() => Number)
  @IsInt()
  casoId!: number

  @ApiProperty({
    description: 'Nombres de la persona implicada',
    example: 'Juan Carlos',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombres!: string

  @ApiPropertyOptional({
    description: 'Apellido paterno',
    example: 'Mamani',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  paterno?: string

  @ApiPropertyOptional({
    description: 'Apellido materno',
    example: 'Quispe',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  materno?: string

  @ApiPropertyOptional({
    description: 'Apellido de casada o esposo',
    example: '',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  esposo?: string

  @ApiProperty({
    description: 'Identificador del país o nacionalidad',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  paisId!: number

  @ApiProperty({
    description: 'Identificador del estado civil',
    example: 2,
  })
  @Type(() => Number)
  @IsInt()
  estadoCivilId!: number

  @ApiProperty({
    description: 'Identificador de la profesión',
    example: 15,
  })
  @Type(() => Number)
  @IsInt()
  profesionId!: number

  @ApiProperty({
    description: 'Identificador del tipo de documento',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  tipoDocumentoId!: number

  @ApiProperty({
    description: 'Número de documento de identidad',
    example: '12345678',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  numeroDocumento!: string
}
