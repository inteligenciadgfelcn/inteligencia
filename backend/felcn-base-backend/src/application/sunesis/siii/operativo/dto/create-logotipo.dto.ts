import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
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
