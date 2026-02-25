import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateSustanciaSolidaDto {
  @ApiProperty({ description: 'ID sustancia sólida descripción', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSustanciaSolidaDescripcion: number

  @ApiProperty({ description: 'Cantidad', example: 500 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number

  @ApiProperty({ description: 'Unidad de medida', example: 'KG' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  unidadMedida: string

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsOptional()
  @IsString()
  observaciones?: string
}

export class CreateSustanciaLiquidaDto {
  @ApiProperty({ description: 'ID sustancia líquida descripción', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSustanciaLiquidaDescripcion: number

  @ApiProperty({ description: 'Cantidad', example: 200 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number

  @ApiProperty({ description: 'Unidad de medida', example: 'LT' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  unidadMedida: string

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsOptional()
  @IsString()
  observaciones?: string
}
