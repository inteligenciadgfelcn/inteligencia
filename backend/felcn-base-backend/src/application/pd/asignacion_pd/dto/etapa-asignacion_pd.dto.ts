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

export class RegistrarEtapaProcesalPdDto {
  @ApiProperty({ example: 3, description: 'ID de la etapa' })
  @Type(() => Number)
  @IsInt()
  etapaId!: number

  @ApiProperty({
    example: '2026-09-27T14:30:00-04:00',
    description: 'Fecha de etapa',
  })
  @IsDateString()
  fechaEtapa!: string

  @ApiProperty({
    example: 20,
    description: 'Plazo otorgado en días',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  diasOtorgados!: number

   @ApiPropertyOptional({
    example: 'texto',
    description: 'formalizacion de accion',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  formalizacionAccion?: string

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