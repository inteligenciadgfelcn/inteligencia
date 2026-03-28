import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateDrogaDto {
  @ApiProperty({ description: 'ID estado de droga', example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idEstadoDroga: number

  @ApiProperty({ description: 'Cantidad en gramos', example: 1500.5 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  cantidadGramos: number

  @ApiPropertyOptional({ description: 'Cantidad de unidades', example: 100 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  cantidadUnidades?: number

  @ApiProperty({ description: 'ID forma de transporte', example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idFormaTransporte: number

  @ApiProperty({ description: 'ID país de procedencia', example: 70 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idPaisProcedencia: number

  @ApiProperty({ description: 'ID país de destino', example: 70 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idPaisDestino: number

  @ApiPropertyOptional({ description: 'Costo estimado de la droga', example: 5000.0 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  costo?: number

}
