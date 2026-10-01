import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class DeletePersonasImplicadaPdDto {
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  usuarioActualizacion?: string;
}