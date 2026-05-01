import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator'

export class CreateDetenidoDto {
  @ApiProperty({
    example: 1,
    description: 'ID del operativo',
  })
  @IsInt()
  idOperativo!: number

  @ApiProperty({
    example: 'JUAN',
    description: 'Nombres del detenido',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  nombres?: string

  @ApiProperty({
    example: 'PEREZ',
    description: 'Apellido paterno',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  apellidoPaterno?: string

  @ApiProperty({
    example: 'GOMEZ',
    description: 'Apellido materno',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  apellidoMaterno?: string

  @ApiProperty({
    example: '',
    description: 'Apellido de esposo',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  apellidoEsposo?: string

  @ApiProperty({
    example: 1,
    description: 'ID del país',
    required: false,
  })
  @IsOptional()
  @IsInt()
  idPais?: number

  @ApiProperty({
    example: true,
    description: 'Género (true = masculino, false = femenino)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  genero?: boolean

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
    description: 'Dirección del detenido',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  direccion?: string

  @ApiProperty({
    example: 1,
    description: 'Tipo de documento',
    required: false,
  })
  @IsOptional()
  @IsInt()
  idTipoDocumento?: number

  @ApiProperty({
    example: '12345678',
    description: 'Número de documento',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  numeroDocumento?: string

  @ApiProperty({
    example: 1,
    description: 'Estado del detenido',
    required: false,
  })
  @IsOptional()
  @IsInt()
  idEstado?: number
}