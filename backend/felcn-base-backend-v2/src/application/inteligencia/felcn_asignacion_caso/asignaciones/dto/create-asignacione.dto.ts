import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAsignacionDto {
  @ApiProperty({ example: 'Codigo de servicio' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  codigoServicio!: string;

  @ApiProperty({ example: 'ICIA-2' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  usuario!: string;

  @ApiProperty({ example: 'LP' })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  idDepartamento!: string;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idGrupo!: number;

  @ApiProperty({ example: 'Operativo Antinarcóticos' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreCaso!: string;

  @ApiProperty({ example: '12-05-2025 16:00' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  fechaSolicitud!: string;

  @ApiProperty({ example: 'Juan Marquez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreSolicitud!: string;

  @ApiProperty({ example: '71234567' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefonoSolicitud!: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  asignado!: string;

  @ApiProperty({ example: '70000000' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefonoAsignado!: string;

  @ApiProperty({ example: 'Dra. María López' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fiscalAsignado!: string;

  @ApiProperty({ example: '72000000' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefonoFiscal!: string;
}
