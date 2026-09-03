import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAsignacionDto {
  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ianus?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  etaInv?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  resultado?: boolean;

  @ApiPropertyOptional({ example: 'Nombre actualizado' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nombreCaso?: string;

  @ApiPropertyOptional({ example: '71234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefonoSolicitud?: string;

  @ApiPropertyOptional({ example: 'Dra. María López' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  fiscalAsignado?: string;

  @ApiPropertyOptional({ example: '72000000' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefonoFiscal?: string;
  
  @ApiPropertyOptional({ example: '12-05-2025 16:00' })
  @IsOptional()
  @IsString()
  fechaSolicitud!: String;
}
