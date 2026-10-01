import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class DeletePersonasImplicadaDto {
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  usuarioActualizacion?: string;
}