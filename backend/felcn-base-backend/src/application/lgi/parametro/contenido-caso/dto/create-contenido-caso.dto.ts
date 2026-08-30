import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateContenidoCasoDto {
  @ApiProperty({ example: 'Recurso humano' })
  @IsString()
  @MaxLength(255)
  descripcion: string;
}