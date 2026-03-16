import { IsNotEmpty, IsOptional, IsInt, Min } from '@/common/validation'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CrearGradoDto {
  @ApiProperty({ example: 'Tte.' })
  @IsNotEmpty()
  abreviatura: string

  @ApiProperty({ example: 'Teniente' })
  @IsNotEmpty()
  descripcion: string

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  orden?: number
}

export class ActualizarGradoDto {
  @ApiPropertyOptional({ example: 'Tte.' })
  @IsOptional()
  abreviatura?: string

  @ApiPropertyOptional({ example: 'Teniente' })
  @IsOptional()
  descripcion?: string

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  orden?: number
}
