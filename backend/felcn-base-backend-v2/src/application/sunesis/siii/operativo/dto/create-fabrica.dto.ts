import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateFabricaDto {
  @ApiProperty({ description: 'ID modelo de fábrica', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idFabricaModelo: number

  @ApiProperty({ description: 'Cantidad', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsOptional()
  @IsString()
  observaciones?: string
}
