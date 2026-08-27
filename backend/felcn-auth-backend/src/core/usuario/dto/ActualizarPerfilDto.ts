import { IsNumberInRangeConstraint, IsNumberString } from '@/common/validation'
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator'

export class ActualizarPerfilDto {
  @IsOptional()
  @IsString()
  nombres?: string

  @IsOptional()
  @IsString()
  primerApellido?: string

  @IsOptional()
  @IsString()
  segundoApellido?: string

  @IsOptional()
  @IsEmail()
  correoElectronico?: string

  @IsOptional()
  @IsNumberString()
  @Validate(IsNumberInRangeConstraint, [60000000, 79999999])
  telefono?: string | null

  /**
   * Estructura FELCN — solo puede enviarse una vez (ver
   * UsuarioService.actualizarPerfil / `fechaPerfilCompletado`). Los 3 campos
   * deben ir juntos, no se acepta completar solo alguno.
   */
  @IsOptional()
  @IsInt()
  idGrado?: number

  @IsOptional()
  @IsInt()
  idGrupo?: number

  @IsOptional()
  @IsString()
  numeroPase?: string
}
