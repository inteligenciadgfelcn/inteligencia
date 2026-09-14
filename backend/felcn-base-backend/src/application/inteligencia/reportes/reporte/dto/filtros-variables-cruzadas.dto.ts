import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FiltrosVariablesCruzadasDto {
  @ApiPropertyOptional({
    example: 'LP-G-2/26',
    description: 'Número de caso',
  })
  @IsOptional()
  @IsString()
  numeroCaso?: string;

  @ApiPropertyOptional({
    example: 'Operativo 6 de Marzo',
    description: 'Nombre del caso',
  })
  @IsOptional()
  @IsString()
  nombreCaso?: string;

  @ApiPropertyOptional({
    example: 'CUD-12345678',
    description: 'Número de CUD registrado en ianus',
  })
  @IsOptional()
  @IsString()
  cud?: string;

  @ApiPropertyOptional({
    example: 'JUANA',
  })
  @IsOptional()
  @IsString()
  nombres?: string;

  @ApiPropertyOptional({
    example: 'DE',
  })
  @IsOptional()
  @IsString()
  apellidoPaterno?: string;

  @ApiPropertyOptional({
    example: 'ARCO',
  })
  @IsOptional()
  @IsString()
  apellidoMaterno?: string;

  @ApiPropertyOptional({
    example: '',
  })
  @IsOptional()
  @IsString()
  apellidoEsposo?: string;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idPais?: number;

  @ApiPropertyOptional({
    enum: ['MASCULINO', 'FEMENINO'],
    example: 'FEMENINO',
  })
  @IsOptional()
  @IsIn(['MASCULINO', 'FEMENINO'])
  genero?: 'MASCULINO' | 'FEMENINO';

  @ApiPropertyOptional({
    example: '1990-01-01',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  fechaNacimientoDesde?: string;

  @ApiPropertyOptional({
    example: '2010-12-31',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  fechaNacimientoHasta?: string;

  @ApiPropertyOptional({
    example: '123456',
  })
  @IsOptional()
  @IsString()
  numeroDocumento?: string;

  @ApiPropertyOptional({
    example: 'AV. BOLIVIA',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({
    example: 'Arrestado',
  })
  @IsOptional()
  @IsString()
  estadoPersona?: string;

  @ApiPropertyOptional({
    example: '2026-01-01',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  fechaRegistroDesde?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  fechaRegistroHasta?: string;

  @ApiPropertyOptional({
    example: '2026-01-01',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  fechaOperativoDesde?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  fechaOperativoHasta?: string;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idUnidad?: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idGrupo?: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idDistrito?: number;

  @ApiPropertyOptional({
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idDepartamento?: number;

  @ApiPropertyOptional({
    enum: ['TODOS', 'FILIADO', 'SIN_FILIAR'],
    default: 'TODOS',
    example: 'TODOS',
  })
  @IsOptional()
  @IsIn(['TODOS', 'FILIADO', 'SIN_FILIAR'])
  filiacion?: 'TODOS' | 'FILIADO' | 'SIN_FILIAR';

  @ApiPropertyOptional({
    example: 1,
    description: 'Estado civil registrado en SII',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idEstadoCivil?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Condición de vida registrada en SII',
  })
  @IsOptional()
  @IsBoolean()
  estaVivo?: boolean;

  @ApiPropertyOptional({
    example: '2026-01-01',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  fechaIngresoSiiDesde?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  fechaIngresoSiiHasta?: string;
}