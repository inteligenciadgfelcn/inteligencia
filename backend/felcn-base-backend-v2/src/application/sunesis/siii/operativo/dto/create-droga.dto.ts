import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateDrogaDto {
  @ApiProperty({ description: 'ID tipo de droga', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idTipoDroga: number

  @ApiProperty({ description: 'ID estado de droga', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idEstadoDroga: number

  @ApiProperty({ description: 'Cantidad en gramos', example: 1500.5 })
  @IsNotEmpty()
  @IsNumber()
  cantidadGramos: number

  @ApiPropertyOptional({ description: 'Cantidad de unidades', example: 100 })
  @IsOptional()
  @IsNumber()
  cantidadUnidades?: number

  @ApiProperty({ description: 'ID forma de transporte', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idFormaTransporte: number

  @ApiProperty({ description: 'ID país de procedencia', example: 70 })
  @IsNotEmpty()
  @IsNumber()
  idPaisProcedencia: number

  @ApiProperty({ description: 'ID país de destino', example: 70 })
  @IsNotEmpty()
  @IsNumber()
  idPaisDestino: number

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsOptional()
  @IsString()
  observaciones?: string
}
