import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateSustanciaSolidaDto {
  @ApiProperty({ description: 'ID sustancia sólida descripción', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSustanciaSolidaDescripcion: number

  @ApiProperty({ description: 'Cantidad en KG', example: 2.75 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number

  @ApiPropertyOptional({ description: 'Costo estimado', example: 100.0 })
  @IsOptional()
  @IsNumber()
  costo?: number
}

export class CreateSustanciaLiquidaDto {
  @ApiProperty({ description: 'ID sustancia líquida descripción', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSustanciaLiquidaDescripcion: number

  @ApiProperty({ description: 'Cantidad en LT', example: 15.5 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number

  @ApiPropertyOptional({ description: 'Costo estimado', example: 100.0 })
  @IsOptional()
  @IsNumber()
  costo?: number
}
