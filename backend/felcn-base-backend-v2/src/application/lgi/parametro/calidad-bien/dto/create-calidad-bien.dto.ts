import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCalidadBienDto {
  @ApiProperty({ example: 'Recurso humano' })
  @IsString()
  @MaxLength(255)
  descripcion: string;
}