import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator'

/**
 * DTO para registrar el detalle de una llamada (fiscalía) dentro de un flujo telefónico
 */
export class CreateFlujoFiscaliaDto {
  @ApiProperty({ description: 'Servicio de la llamada', maxLength: 15 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  servicio: string

  @ApiProperty({ description: 'Registro / expediente de referencia', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  registro: string

  @ApiProperty({ description: 'Número telefónico del extremo A', maxLength: 15 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  numeroA: string

  @ApiProperty({ description: 'IMEI del extremo A', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  imeiA: string

  @ApiProperty({ description: 'RBS (radio base) del extremo A', maxLength: 25 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  rbsA: string

  @ApiProperty({ description: 'Celda del extremo A', maxLength: 10 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  celdaA: string

  @ApiProperty({ description: 'Latitud del extremo A', example: -16.5 })
  @Type(() => Number)
  @IsNumber()
  latA: number

  @ApiProperty({ description: 'Longitud del extremo A', example: -68.15 })
  @Type(() => Number)
  @IsNumber()
  lonA: number

  @ApiProperty({ description: 'Número telefónico del extremo B', maxLength: 15 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  numeroB: string

  @ApiProperty({ description: 'Titular del extremo B', maxLength: 80 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  titular: string

  @ApiProperty({ description: 'IMEI del extremo B', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  imeiB: string

  @ApiProperty({ description: 'RBS (radio base) del extremo B', maxLength: 25 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  rbsB: string

  @ApiProperty({ description: 'Celda del extremo B', maxLength: 10 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  celdaB: string

  @ApiProperty({ description: 'Latitud del extremo B', example: -16.51 })
  @Type(() => Number)
  @IsNumber()
  latB: number

  @ApiProperty({ description: 'Longitud del extremo B', example: -68.16 })
  @Type(() => Number)
  @IsNumber()
  lonB: number

  @ApiProperty({
    description: 'Fecha y hora de la llamada (ISO 8601)',
    example: '2026-07-11T14:30:00',
  })
  @IsDateString()
  fechaHora: string

  @ApiProperty({ description: 'Duración de la llamada', example: '00:03:25', maxLength: 15 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  duracion: string
}
