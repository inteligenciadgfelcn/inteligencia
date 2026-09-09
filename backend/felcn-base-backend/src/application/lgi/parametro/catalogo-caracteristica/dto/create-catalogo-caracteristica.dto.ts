import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCatalogoCaracteristicasDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  catclasId: number;

  @ApiProperty({ example: 'Color' })
  @IsString()
  @MaxLength(255)
  descripcion: string;
}