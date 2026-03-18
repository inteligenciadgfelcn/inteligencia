import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDepartamentoDto {
  @ApiProperty({
    example: 'LP',
    description: 'Código del departamento',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigo: string;

  @ApiProperty({
    example: 'La Paz',
    description: 'Nombre del departamento',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiProperty({
    example: 1,
    description: 'ID del país al que pertenece el departamento',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idPais: number;
}
