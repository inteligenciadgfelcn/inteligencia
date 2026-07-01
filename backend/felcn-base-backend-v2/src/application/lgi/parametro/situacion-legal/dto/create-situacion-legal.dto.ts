import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateSituacionLegalDto {
  @ApiProperty({ example: 'Activo' })
  @IsString()
  @MaxLength(255)
  descripcion: string;
}