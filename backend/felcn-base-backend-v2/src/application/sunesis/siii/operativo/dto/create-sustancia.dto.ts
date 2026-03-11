import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateSustanciaSolidaDto {
  @ApiProperty({ description: 'ID sustancia sólida descripción', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSustanciaSolidaDescripcion: number

  @ApiProperty({ description: 'Cantidad en KG', example: 2.75 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number
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
}
