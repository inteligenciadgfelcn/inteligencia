import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator'

export class CreateBienSecuestradoDto {
  @ApiProperty({ description: 'ID catálogo tipo', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idCatalogoTipo: number

  @ApiProperty({ description: 'Cantidad de bienes', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  cantidadBien: number

  @ApiPropertyOptional({ description: 'Costo aproximado', example: 15000 })
  @IsOptional()
  @IsNumber()
  costoAproximado?: number

  @ApiPropertyOptional({ description: 'Costo cuantificado', example: 12000 })
  @IsOptional()
  @IsNumber()
  costoCuantificado?: number

  @ApiPropertyOptional({ description: 'En investigación', example: false })
  @IsOptional()
  @IsBoolean()
  enInvestigacion?: boolean
}
