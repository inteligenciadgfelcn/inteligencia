import { IsNotEmpty, IsBoolean, IsOptional } from '@/common/validation'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CrearUnidadDto {
  @ApiProperty({ example: 'FELCN-LPZ' })
  @IsNotEmpty()
  abreviatura: string

  @ApiProperty({ example: 'Fuerza Especial de Lucha Contra el Narcotráfico - La Paz' })
  @IsNotEmpty()
  descripcion: string

  @ApiProperty({ example: true })
  @IsBoolean()
  esOperativaAdmin: boolean
}

export class ActualizarUnidadDto {
  @ApiPropertyOptional({ example: 'FELCN-LPZ' })
  @IsOptional()
  abreviatura?: string

  @ApiPropertyOptional({ example: 'Fuerza Especial de Lucha Contra el Narcotráfico - La Paz' })
  @IsOptional()
  descripcion?: string

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  esOperativaAdmin?: boolean
}
