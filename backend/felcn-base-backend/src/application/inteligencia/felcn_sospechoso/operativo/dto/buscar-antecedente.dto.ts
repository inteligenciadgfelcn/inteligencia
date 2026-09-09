import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BuscarAntecedenteDto {

  @ApiPropertyOptional({ example: '12345678', description: 'CI de la persona' })
  @IsOptional()
  @IsString()
  ci?: string;

  @ApiPropertyOptional({ example: 'Juan' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Perez' })
  @IsOptional()
  @IsString()
  apellidoPaterno?: string;

  @ApiPropertyOptional({ example: 'Lopez' })
  @IsOptional()
  @IsString()
  apellidoMaterno?: string;
}