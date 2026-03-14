import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateLogotipoDto {
  @ApiProperty({ description: 'Nombre/código del logotipo', example: 'CALI-01' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  imagen: string

  @ApiProperty({ description: 'Descripción del logotipo' })
  @IsNotEmpty()
  @IsString()
  descripcionLogo: string

  @ApiProperty({ description: 'ID del tipo de droga', example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idTipoDroga: number

  @ApiProperty({ description: 'ID del país de origen', example: 70 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idPaisOrigen: number

  @ApiProperty({ description: 'ID del país destino', example: 70 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idPaisDestino: number

  @ApiProperty({ description: 'Organización', example: 'Cartel X' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  organizacion: string

  @ApiPropertyOptional({ description: 'Blanco/objetivo' })
  @IsOptional()
  @IsString()
  blanco?: string

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsOptional()
  @IsString()
  observacion?: string

  @ApiPropertyOptional({ description: 'Enlace relacionado' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  enlace?: string
}
