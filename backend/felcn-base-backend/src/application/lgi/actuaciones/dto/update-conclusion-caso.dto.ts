import {
  ApiPropertyOptional,
} from '@nestjs/swagger'
import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class UpdateConclusionCasoDto {
  @ApiPropertyOptional({
    description:
      'Tipologías identificadas durante la investigación',
    example:
      'Uso de empresas fachada y adquisición de bienes',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  tipologiasIdentificadas?: string | null

  @ApiPropertyOptional({
    description:
      'Verbos rectores identificados en el caso',
    example:
      'Adquirir, convertir, transferir y ocultar',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  verbosRectores?: string | null

  @ApiPropertyOptional({
    description:
      'Etapas del ciclo de legitimación de ganancias ilícitas',
    example:
      'Colocación, estratificación e integración',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  etapasCicloLgi?: string | null
}