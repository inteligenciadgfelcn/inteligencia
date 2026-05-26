import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

/**
 * DTO reutilizable para georeferenciación GIS
 * Usado en lugar_blanco, lugar_empresa y lugar_bien
 * Equivalente a InsertGis de los tres módulos legados
 */
export class CreateLugarGisDto {
  @ApiProperty({
    description: 'Descripción del lugar',
    example: 'DOMICILIO PRINCIPAL',
    maxLength: 150,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  descripcion: string

  @ApiProperty({
    description: 'Latitud decimal (coordenada X)',
    example: -16.4958,
  })
  @Type(() => Number)
  @IsNumber()
  coordenadasX: number

  @ApiProperty({
    description: 'Longitud decimal (coordenada Y)',
    example: -68.1334,
  })
  @Type(() => Number)
  @IsNumber()
  coordenadasY: number

  @ApiProperty({ description: 'Información adicional del lugar' })
  @IsNotEmpty()
  @IsString()
  contenido: string
}
