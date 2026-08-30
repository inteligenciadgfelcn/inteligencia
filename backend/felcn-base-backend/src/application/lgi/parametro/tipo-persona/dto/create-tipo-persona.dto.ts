import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateTipoPersonaDto {
  @ApiProperty({ example: 'Recurso humano' })
  @IsString()
  @MaxLength(255)
  descripcion: string;
}