import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCatalogoTipoDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  catclasId: number;

  @ApiProperty({ example: 'Equipo de Cómputo' })
  @IsString()
  @MaxLength(255)
  descripcion: string;
}