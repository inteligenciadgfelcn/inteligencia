import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

/**
 * DTO para registrar un perfil de red social del blanco
 * Equivalente a RegBlancos.InsertRedSocial del sistema legado
 */
export class CreateRedSocialDto {
  @ApiProperty({
    description: 'Tipo de red social',
    example: 'Facebook',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  tipoRed: string

  @ApiProperty({
    description: 'URL o dirección del perfil',
    example: 'https://facebook.com/usuario',
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  direccion: string
}
