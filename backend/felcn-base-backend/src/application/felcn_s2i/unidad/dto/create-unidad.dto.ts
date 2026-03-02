import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUnidadDto {
  @ApiProperty({
    example: 'UM',
    description: 'Código único de la unidad',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  abreviatura: string;

  @ApiProperty({
    example: 'Unidad Movil de Patrullaje Rural',
    description: 'Descripción de la unidad',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;

  @ApiProperty({
    example: true,
    description: 'Indica si la unidad es operativa administrativa',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  opAdm?: boolean;
}
