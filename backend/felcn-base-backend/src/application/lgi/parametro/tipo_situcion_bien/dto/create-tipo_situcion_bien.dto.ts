import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateTipoSituacionLegalBienDto {
  @ApiProperty({ example: 'Secuestrado' })
  @IsString()
  @MaxLength(255)
  descripcion: string;
}