import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'

export class RegistrarEtapaProcesalDto {
  @ApiProperty({ example: 3, description: 'ID de la etapa' })
  @Type(() => Number)
  @IsInt()
  etapaId!: number

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del estado del caso',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idEstado?: number

  @ApiProperty({
    example: '2026-09-27T14:30:00-04:00',
    description: 'Fecha y hora de recepción de Fiscalía',
  })
  @IsDateString()
  fechaRecepcionFiscalia!: string

  @ApiProperty({
    example: 20,
    description: 'Plazo otorgado en días',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  diasOtorgados!: number

  @ApiPropertyOptional({
    example: 'Resolución fiscal recibida',
    description: 'Obligatoria cuando se adjunta PDF',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  descripcionDocumento?: string

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'PDF opcional, máximo 10 MB',
  })
  documento?: Express.Multer.File
}