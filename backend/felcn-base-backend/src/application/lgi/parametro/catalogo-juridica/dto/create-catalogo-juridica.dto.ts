import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCatalogoJuridicaDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  catclasId: number;

  @ApiProperty({ example: 'Persona Natural' })
  @IsString()
  @MaxLength(255)
  descripcion: string;
}