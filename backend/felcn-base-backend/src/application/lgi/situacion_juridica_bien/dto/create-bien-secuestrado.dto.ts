import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateBienSecuestadoDto {
  @ApiPropertyOptional({
    description: 'Nombre del fiscal',
    example: 'Juan Pérez López',
    maxLength: 250,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  fiscal?: string | null

  @ApiProperty({
    description: 'Fecha del acta de secuestro',
    example: '2026-09-06',
  })
  @IsDateString()
  fechaActaSecuestro: string

  @ApiPropertyOptional({
    description: 'Nombre del investigador',
    example: 'Carlos Mamani Quispe',
    maxLength: 250,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  investigador?: string | null
}
