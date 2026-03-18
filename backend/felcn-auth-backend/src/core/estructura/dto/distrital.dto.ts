import { IsNotEmpty, IsInt, IsPositive, IsOptional } from '@/common/validation'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CrearDistritaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idUnidad: number

  @ApiProperty({ example: 'Distrital La Paz Centro' })
  @IsNotEmpty()
  descripcion: string
}

export class ActualizarDistritaDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  idUnidad?: number

  @ApiPropertyOptional({ example: 'Distrital La Paz Centro' })
  @IsOptional()
  descripcion?: string
}
