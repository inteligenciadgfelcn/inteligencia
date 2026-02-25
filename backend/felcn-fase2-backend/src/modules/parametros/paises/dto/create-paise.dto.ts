import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaisDto {
  @ApiProperty({
    example: 'BO',
    description: 'Código único del país',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigo: string;

  @ApiProperty({
    example: 'Bolivia',
    description: 'Nombre oficial del país',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiProperty({
    example: 1,
    description: 'ID del continente al que pertenece el país',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idContinente: number;
}