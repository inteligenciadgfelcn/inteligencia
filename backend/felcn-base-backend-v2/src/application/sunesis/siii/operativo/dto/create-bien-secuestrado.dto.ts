import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator'

export class CreateBienSecuestradoDto {
  @ApiProperty({ description: 'ID catálogo tipo', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idCatalogoTipo: number

  @ApiProperty({ description: 'Cantidad', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number

  @ApiPropertyOptional({ description: 'Costo aproximado', example: 15000 })
  @IsOptional()
  @IsNumber()
  costoAproximado?: number

  @ApiPropertyOptional({ description: 'Costo cuantificado', example: 12000 })
  @IsOptional()
  @IsNumber()
  costoCuantificado?: number

  @ApiPropertyOptional({ description: 'Es para investigación', example: false })
  @IsOptional()
  @IsBoolean()
  esInvestigacion?: boolean

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsOptional()
  @IsString()
  observaciones?: string
}
