import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

/**
 * DTO de búsqueda de asignaciones LGI
 * Origen: sistema legacy GIAEF — pg.sql (docs/migrations/pg.sql)
 */
export class BuscarAsignacionLgiQueryDto {
  @ApiPropertyOptional({ description: 'Abreviatura de unidad (3 chars) — filtro principal' })
  @IsOptional()
  @IsString()
  uniAbrev?: string

  @ApiPropertyOptional({ description: 'Número de caso GIAEF — coincidencia exacta' })
  @IsOptional()
  @IsString()
  nroCasoGiaef?: string

  @ApiPropertyOptional({ description: 'Número de caso FELCN — coincidencia exacta' })
  @IsOptional()
  @IsString()
  nroCaso?: string

  @ApiPropertyOptional({ description: 'Número de caso Fiscalía — coincidencia exacta' })
  @IsOptional()
  @IsString()
  nroCasoFis?: string

  @ApiPropertyOptional({ description: 'Nombre del caso — búsqueda parcial ILIKE' })
  @IsOptional()
  @IsString()
  nombreCaso?: string

  @ApiPropertyOptional({ description: 'Número de caso Pérdida de Dominio — coincidencia exacta' })
  @IsOptional()
  @IsString()
  nroCasoPerDom?: string

  @ApiPropertyOptional({ description: 'Filtrar casos con pérdida de dominio activa' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  perdDom?: boolean
}
