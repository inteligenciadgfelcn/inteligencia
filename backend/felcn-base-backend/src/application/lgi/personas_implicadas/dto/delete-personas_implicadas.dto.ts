import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class DeletePersonasImplicadaDto {
  /*
   * Lo agrega el interceptor en PATCH.
   * No se envía desde el frontend.
   */
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  usuarioActualizacion?: string;
}