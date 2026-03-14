import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateFabricaDto {
  @ApiProperty({ description: 'ID modelo de fábrica', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idFabricaModelo: number

  @ApiProperty({ description: 'Cantidad', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number
}
