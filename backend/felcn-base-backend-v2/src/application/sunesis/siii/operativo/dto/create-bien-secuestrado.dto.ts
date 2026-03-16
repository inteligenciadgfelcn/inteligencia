import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type, Transform } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator'

export class CreateBienSecuestradoDto {
  @ApiProperty({ description: 'ID catálogo tipo', example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idCatalogoTipo: number

  @ApiProperty({ description: 'Cantidad de bienes', example: 2 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  cantidadBien: number

  @ApiPropertyOptional({ description: 'Costo aproximado', example: 15000 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  costoAproximado?: number

  @ApiPropertyOptional({ description: 'Costo cuantificado', example: 12000 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  costoCuantificado?: number

  @ApiPropertyOptional({ description: 'En investigación', example: false })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true
    if (value === 'false' || value === false) return false
    return value
  })
  @IsOptional()
  @IsBoolean()
  enInvestigacion?: boolean
}
