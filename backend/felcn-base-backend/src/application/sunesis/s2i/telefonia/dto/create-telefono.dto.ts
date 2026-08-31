import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, IsNotEmpty } from 'class-validator'

export class CreateTelefonoDto {
  @ApiProperty({ description: 'Número de teléfono del primer interlocutor', example: '77712345' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  numero1: string

  @ApiProperty({ description: 'Propietario del primer número', example: 'JUAN PEREZ' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  propietario1: string

  @ApiProperty({ description: 'Contenido del mensaje o transcripción' })
  @IsString()
  @IsNotEmpty()
  mensaje: string

  @ApiProperty({ description: 'Número de teléfono del segundo interlocutor', example: '71154321' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  numero2: string

  @ApiProperty({ description: 'Propietario del segundo número', example: 'MARIA LOPEZ' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  propietario2: string
}
