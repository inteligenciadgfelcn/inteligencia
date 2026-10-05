import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'

export class CreateSituacionJuridicaPdDto {
  @ApiProperty({
    description: 'ID del bien secuestrado',
    example: '150',
    type: String,
  })
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  itemBienSecId: string

  @ApiProperty({
    description: 'Fiscalía que interviene',
    example: 'Fiscalía Departamental de La Paz',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fiscalia: string

  @ApiProperty({
    description: 'Fecha y hora de la resolución',
    example: '2026-10-04T14:30:00',
    type: String,
  })
  @IsNotEmpty()
  @IsDateString()
  fechaResolucion: string

  @ApiProperty({
    description: 'Autoridad que emite la resolución',
    example: 'Dra. María Pérez',
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  autoridad: string

  @ApiPropertyOptional({
    description: 'ID de la medida cautelar',
    example: 1,
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  idMedidaCautelar?: number | null
}