import { IsOptional, IsString } from 'class-validator'

export class AuditoriaDto {
  @IsOptional()
  @IsString()
  usuario?: string

  @IsOptional()
  @IsString()
  usuarioActualizacion?: string
}