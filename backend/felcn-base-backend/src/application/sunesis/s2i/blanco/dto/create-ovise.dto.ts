import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

/**
 * DTO para registrar un reporte OVISE (seguimiento georreferenciado) del blanco
 */
export class CreateOviseDto {
  @ApiProperty({
    description: 'Lugar del reporte',
    example: 'El Alto, Zona 16 de Julio',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lugar: string

  @ApiProperty({ description: 'Latitud del reporte', example: -16.5 })
  @Type(() => Number)
  @IsNumber()
  latitud: number

  @ApiProperty({ description: 'Longitud del reporte', example: -68.15 })
  @Type(() => Number)
  @IsNumber()
  longitud: number

  @ApiProperty({ description: 'Detalle del reporte' })
  @IsNotEmpty()
  @IsString()
  reporte: string

  @ApiProperty({
    description: 'Acción realizada/reportada',
    example: 'SEGUIMIENTO',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  accion: string
}
