import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

/**
 * DTO para los endpoints de búsqueda de asignaciones ingresadas / sin ingresar.
 * Origen: FRM-INF-ING.aspx.cs
 */
export class BuscarIngresoDto {
  @ApiProperty({ description: 'ID del distrital del usuario', example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  idDistrital: number

  @ApiPropertyOptional({ description: 'Número de caso (búsqueda exacta)', example: 'LP-A-1/25' })
  @IsString()
  @IsOptional()
  nroCaso?: string

  @ApiPropertyOptional({ description: 'Nombre del caso (búsqueda exacta, ignora mayúsculas)', example: 'OPERATIVO ALFA' })
  @IsString()
  @IsOptional()
  nombreCaso?: string

  @ApiPropertyOptional({ description: 'Fecha inicio rango (ISO 8601)', example: '2025-01-01' })
  @IsString()
  @IsOptional()
  desde?: string

  @ApiPropertyOptional({ description: 'Fecha fin rango (ISO 8601)', example: '2025-12-31' })
  @IsString()
  @IsOptional()
  hasta?: string

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  limite: number = 10

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pagina: number = 1

  get saltar(): number {
    return (this.pagina - 1) * this.limite
  }
}
