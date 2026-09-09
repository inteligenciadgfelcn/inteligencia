import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDistritalDto {
  @ApiProperty({
    example: 'Distrito Central',
    description: 'Descripción del distrital',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  descripcion: string;

  @ApiProperty({
    example: 1,
    description: 'ID de la unidad a la que pertenece el distrital',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idUnidad: number;
}
