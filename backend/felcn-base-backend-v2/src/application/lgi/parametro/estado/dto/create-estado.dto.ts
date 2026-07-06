import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateEstadoDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  etId: number;

  @ApiProperty({ example: 'Activo' })
  @IsString()
  @MaxLength(255)
  descripcion: string;
}