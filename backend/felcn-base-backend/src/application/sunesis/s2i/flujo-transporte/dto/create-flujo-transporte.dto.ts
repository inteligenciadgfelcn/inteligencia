import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsDateString,
  MaxLength,
} from 'class-validator'

export class CreateFlujoTransporteDto {
  @ApiProperty({
    description: 'Código de transporte (placa) ya resuelto',
    example: '1234ABC',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigoTransporte: string

  @ApiProperty({
    description: 'Número de documento del conductor ya resuelto',
    example: '1234567',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  numeroDocumento: string

  @ApiProperty({ description: 'ID del lugar (public.lugar)', example: 1 })
  @IsInt()
  idLugar: number

  @ApiProperty({ description: 'ID del color (parametricas.color)', example: 1 })
  @IsInt()
  idColor: number

  @ApiProperty({ description: 'Origen del viaje', example: 'LA PAZ' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  origen: string

  @ApiProperty({ description: 'Destino del viaje', example: 'EL ALTO' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  destino: string

  @ApiProperty({
    description: 'Carga transportada',
    example: 'MERCADERIA GENERAL',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  carga: string

  @ApiProperty({
    description: 'Fecha y hora del viaje (ISO)',
    example: '2026-07-17T10:30:00',
  })
  @IsDateString()
  fechaHora: string

  @ApiProperty({ description: 'Latitud del punto registrado', example: -16.5 })
  @IsNumber()
  latitud: number

  @ApiProperty({
    description: 'Longitud del punto registrado',
    example: -68.15,
  })
  @IsNumber()
  longitud: number
}
