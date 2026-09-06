import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateBienIncautadoDto {
  @ApiPropertyOptional({
    description: 'Número de resolución',
    example: 'RES-123/2026',
    maxLength: 30,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nroResol?: string | null

  @ApiProperty({
    description: 'Fecha de la resolución',
    example: '2026-09-06',
  })
  @IsDateString()
  fechaResolucion: string

  @ApiPropertyOptional({
    description: 'Autoridad que emitió la resolución',
    example: 'Fiscalía Departamental de La Paz',
    maxLength: 300,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  autoridad?: string | null
}
