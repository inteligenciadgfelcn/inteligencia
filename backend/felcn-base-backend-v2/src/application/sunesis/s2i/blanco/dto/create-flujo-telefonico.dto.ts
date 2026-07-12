import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

/**
 * DTO para registrar un flujo telefónico (empresa/línea) del blanco
 */
export class CreateFlujoTelefonicoDto {
  @ApiProperty({
    description: 'Empresa operadora del servicio telefónico',
    example: 'ENTEL',
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  empresa: string

  @ApiProperty({
    description: 'Dirección o domicilio asociado a la línea',
    example: 'Av. Arce N° 123',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  direccion: string

  @ApiProperty({
    description: 'Número telefónico',
    example: '70012345',
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  numero: string
}
