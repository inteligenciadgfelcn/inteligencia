import { ApiProperty } from '@nestjs/swagger'
import {
  CorreoLista,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from '@/common/validation'
import { Type } from 'class-transformer'
import { PersonaDto } from './persona.dto'

export class CrearUsuarioCuentaDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto

  @ApiProperty({ example: '123456@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string

  @ApiProperty({ example: 'AGEPIC.admin135' })
  @IsString()
  @IsNotEmpty()
  contrasenaNueva: string
}
