import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class BuscarAsignacionQueryDto {
  @ApiPropertyOptional({ description: 'Abreviatura de la unidad (requerida salvo búsqueda por investigador)' })
  @IsOptional()
  @IsString()
  abreviaturaUnidad?: string

  @ApiPropertyOptional({ description: 'Número de caso FELCN — coincidencia exacta, filtrado por unidad' })
  @IsOptional()
  @IsString()
  nroCaso?: string

  @ApiPropertyOptional({ description: 'Usuario del investigador — JOIN con tabla investigador, sin filtro de unidad (Button3_Click)' })
  @IsOptional()
  @IsString()
  investigador?: string

  @ApiPropertyOptional({ description: 'Nombre del caso — búsqueda parcial LIKE, filtrado por unidad' })
  @IsOptional()
  @IsString()
  nombreCaso?: string

  @ApiPropertyOptional({ description: 'Número de caso Perdida de Dominio — coincidencia exacta, filtrado por unidad' })
  @IsOptional()
  @IsString()
  nroCasoPerdidaDominio?: string

  @ApiPropertyOptional({ description: 'Número de operativo — coincidencia exacta, filtrado por unidad' })
  @IsOptional()
  @IsString()
  nroOperativo?: string
}
