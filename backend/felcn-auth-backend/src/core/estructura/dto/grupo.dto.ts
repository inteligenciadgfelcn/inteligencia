import { IsNotEmpty, IsInt, IsPositive, IsOptional } from '@/common/validation'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CrearGrupoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idDistrital: number

  @ApiProperty({ example: 'Grupo Operativo Norte' })
  @IsNotEmpty()
  descripcion: string
}

export class ActualizarGrupoDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  idDistrital?: number

  @ApiPropertyOptional({ example: 'Grupo Operativo Norte' })
  @IsOptional()
  descripcion?: string
}
