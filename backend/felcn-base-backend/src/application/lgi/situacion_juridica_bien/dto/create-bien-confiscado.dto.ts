import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateBienConfiscadoDto {
  @ApiPropertyOptional({
    description: 'Número de sentencia judicial',
    example: 'SENT-123/2026',
    maxLength: 50,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numSentJud?: string | null

  @ApiProperty({
    description: 'Fecha de la sentencia judicial',
    example: '2026-09-06',
  })
  @IsDateString()
  fechaSenjud: string

  @ApiPropertyOptional({
    description: 'Autoridad que emitió la sentencia',
    example: 'Juzgado de Sentencia Penal Primero',
    maxLength: 300,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  autoridad?: string | null
}
