import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsInt,
  Min,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator'

export class CreateBienesSecuestradoDto {
  @ApiProperty({
    description: 'Identificador del operativo',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  opId: number

  @ApiProperty({
    description: 'Identificador del tipo o categoría',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  cattipoId: number

  @ApiProperty({
    description: 'Cantidad del bien secuestrado',
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidadBien: number = 1

  @ApiProperty({
    description: 'Costo aproximado del bien',
    example: 1500.5,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costoAprox: number

  @ApiProperty({
    description: 'Costo calculado según la cantidad',
    example: 3001,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costoCuant: number

  @ApiPropertyOptional({
    description: 'Latitud del lugar del secuestro',
    example: -16.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitud?: number

  @ApiPropertyOptional({
    description: 'Longitud del lugar del secuestro',
    example: -68.15,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitud?: number

  @ApiPropertyOptional({
    description: 'Lugar donde se secuestró el bien',
    example: 'Zona Central',
  })
  @IsOptional()
  @IsString()
  lugarSecuestro?: string

  @ApiPropertyOptional({
    description: 'Identificador del tipo de vínculo',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idTipoVinculo?: number

  @ApiPropertyOptional({
    description: 'Nombre completo de la persona vinculada',
    example: 'Juan Pérez López',
  })
  @IsOptional()
  @IsString()
  nombreCompletoVinculo?: string

  @ApiPropertyOptional({
    description: 'Cédula de identidad de la persona vinculada',
    example: '1234567',
  })
  @IsOptional()
  @IsString()
  cedulaIdentidadVinculo?: string

  @ApiPropertyOptional({
    description: 'Autoridad que dispuso el secuestro',
    example: 'Fiscal de Materia',
  })
  @IsOptional()
  @IsString()
  autoridadDisposicion?: string

  @ApiPropertyOptional({
    description: 'Indica si el bien requiere pericia',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true') {
      return true
    }

    if (value === false || value === 'false') {
      return false
    }

    return value
  })
  @IsBoolean()
  pericia?: boolean

  @ApiPropertyOptional({
    description: 'Resultado de la pericia realizada',
    example: 'El bien fue sometido a peritaje técnico',
  })
  @IsOptional()
  @IsString()
  resultadoPericia?: string

   @ApiPropertyOptional({
    description:
      'Fecha del depósito del bien',
    example:
      '2026-08-30T22:00:00-04:00',
  })
  @IsOptional()
  @IsDateString()
  fecha?: string

  @ApiPropertyOptional({
    description:
      'Nombre completo del depositario',
    example: 'María Quispe Mamani',
  })
  @IsOptional()
  @IsString()
  nombreDepositario?: string

  @ApiPropertyOptional({
    description:
      'Cédula de identidad del depositario',
    example: '7654321 LP',
  })
  @IsOptional()
  @IsString()
  ciDepositario?: string

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Primera fotografía del bien',
  })
  @IsOptional()
  rutaFotografia1?: string

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Segunda fotografía del bien',
  })
  @IsOptional()
  rutaFotografia2?: string
}
