import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator'

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

  @ApiProperty({ description: 'ID tipo de droga', example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idTipoDroga: number

  @ApiProperty({ description: 'ID país de origen', example: 70 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idPaisOrigen: number

  @ApiProperty({ description: 'ID país de destino', example: 70 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  idPaisDestino: number

  @ApiProperty({ description: 'Organización', example: 'Cartel X' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  organizacion: string

  @ApiProperty({ description: 'Blanco/objetivo' })
  @IsNotEmpty()
  @IsString()
  blanco: string

  @ApiProperty({ description: 'Observaciones' })
  @IsNotEmpty()
  @IsString()
  observacion: string
}
