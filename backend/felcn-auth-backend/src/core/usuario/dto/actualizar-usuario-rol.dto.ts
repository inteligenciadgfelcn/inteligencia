import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  CorreoLista,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from '@/common/validation'
import { PersonaDto } from './persona.dto'

export class ActualizarUsuarioRolDto {
  @ApiProperty({ example: PersonaDto })
  @ValidateNested()
  @Type(() => PersonaDto)
  persona?: PersonaDto

  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  @ValidateIf((o) => !o.roles)
  @ApiProperty({ example: 'asdfg123@gmail.com' })
  correoElectronico?: string | null

  @ApiProperty({ example: ['3'] })
  @IsNotEmpty()
  @IsArray()
  @ValidateIf((o) => !o.correoElectronico)
  roles: Array<string>

  @IsOptional()
  ciudadaniaDigital?: boolean

  @IsOptional()
  @ApiProperty({ example: 'CNEL. JUAN PÉREZ MAMANI', required: false })
  nombreApp?: string | null

  @IsOptional()
  @ApiProperty({ example: '71234567', required: false })
  telefonoCelular?: string | null

  @IsOptional()
  @ApiProperty({ example: '2234567', required: false })
  telefonoCorporativo?: string | null

  @IsOptional()
  @ApiProperty({ example: 1, required: false, description: 'ID del grado policial/militar' })
  idGrado?: number | null

  @IsOptional()
  @ApiProperty({ example: 1, required: false, description: 'ID del grupo organizacional' })
  idGrupo?: number | null
}
