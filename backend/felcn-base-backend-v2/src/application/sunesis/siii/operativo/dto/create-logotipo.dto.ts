import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator'

export class CreateLogotipoDto {
  @ApiProperty({ description: 'Número de caso', example: 'CASO-2024-001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  numeroCaso: string

  @ApiProperty({ description: 'Número de operativo', example: 'OP-2024-001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  numeroOperativo: string

  @ApiProperty({ description: 'Fecha del operativo', example: '2024-01-15' })
  @IsNotEmpty()
  @IsString()
  fechaOperativo: string

  @ApiProperty({ description: 'Nombre del caso', example: 'Operación Alfa' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  nombreCaso: string

  @ApiProperty({ description: 'Descripción general' })
  @IsNotEmpty()
  @IsString()
  descripcion: string

  @ApiProperty({
    description: 'Nombre del archivo de imagen',
    example: 'logo001.png',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  imagen: string

  @ApiProperty({ description: 'Descripción del logotipo' })
  @IsNotEmpty()
  @IsString()
  descripcionLogo: string

  @ApiProperty({ description: 'ID del tipo de droga', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idTipoDroga: number

  @ApiProperty({ description: 'ID del país de origen', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idPaisOrigen: number

  @ApiProperty({ description: 'ID del país destino', example: 2 })
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
