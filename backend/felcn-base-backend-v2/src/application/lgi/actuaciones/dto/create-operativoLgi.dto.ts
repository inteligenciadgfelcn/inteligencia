import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateOperativoLgiDto {
  @ApiProperty({
    example: 95,
    description: 'Identificador del caso',
  })
  @Type(() => Number)
  @IsInt()
  casosId!: number

  @ApiProperty({
    example: 'INF-001-2026',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  opNrooper!: string

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  idTipoInforme!: number

  @ApiPropertyOptional({
    example: 'Informe de actuación de otro tipo',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  otroInforme?: string

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  idEtapa!: number

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idEstado?: number

  @ApiProperty({
    description: 'Fecha y hora de recepción de Fiscalía',
    example: '2026-08-30T14:30:00-04:00',
  })
  @Type(() => Date)
  @IsDate({
    message: 'La fecha debe ser válida',
  })
  fechaRecepcionFiscalia!: Date

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  diasOtorgados!: number

  @ApiProperty({
    example: 'Descripción detallada del operativo realizado',
  })
  @IsString()
  @IsNotEmpty()
  opDescripcion!: string

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo PDF, DOC o DOCX. Tamaño máximo: 10 MB',
  })
  archivo!: Express.Multer.File
}
