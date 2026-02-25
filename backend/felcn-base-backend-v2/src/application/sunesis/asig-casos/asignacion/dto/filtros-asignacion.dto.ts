import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsBoolean } from 'class-validator'
import { Transform } from 'class-transformer'
import { PaginacionQueryDto } from '@/common/dto'

export class FiltrosAsignacionDto extends PaginacionQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por número de caso' })
  @IsOptional()
  @IsString()
  numeroCaso?: string

  @ApiPropertyOptional({ description: 'Filtrar por número de operativo' })
  @IsOptional()
  @IsString()
  numeroOperativo?: string

  @ApiPropertyOptional({ description: 'Filtrar por usuario login' })
  @IsOptional()
  @IsString()
  usuarioLogin?: string

  @ApiPropertyOptional({ description: 'Filtrar por departamento' })
  @IsOptional()
  @IsString()
  idDepartamento?: string

  @ApiPropertyOptional({ description: 'Filtrar por unidad' })
  @IsOptional()
  @IsString()
  idUnidad?: string

  @ApiPropertyOptional({
    description: 'Solo mostrar casos no aprobados (numero_caso vacío)',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  soloNoAprobados?: boolean
}
