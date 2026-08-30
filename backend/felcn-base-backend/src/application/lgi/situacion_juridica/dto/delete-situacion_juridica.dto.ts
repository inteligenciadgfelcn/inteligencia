import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';

export class DeleteSituacionJuridicaDto {
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  usuarioActualizacion?: string;

  @ApiHideProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaHoraActualizacion?: Date;
}