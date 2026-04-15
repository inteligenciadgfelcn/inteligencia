import { ApiProperty } from "@nestjs/swagger"
import { IsString, MaxLength, IsOptional, IsDateString, IsInt, IsBoolean } from "class-validator"

export class CreateOperativoDto {
   @ApiProperty({ example: 'CASO-123', description: 'Número de caso' })
  @IsString()
  @MaxLength(100)
  numeroCaso!: string

  @ApiProperty({ example: '1687/14', description: 'Número operativo', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  numeroOperativo?: string

  @ApiProperty({
    example: '2014-11-07 12:30:00.000',
    description: 'Fecha del operativo',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaOperativo?: Date

  @ApiProperty({ example: 'LP', description: 'abreviatura departamento' })
  @IsString()
  @MaxLength(3)
  idDepartamento!: string

  @ApiProperty({ example: 1, description: 'ID de la provincia' })
  @IsInt()
  idProvincia!: number

  @ApiProperty({ example: 1, description: 'ID de la localidad' })
  @IsInt()
  idLocalidad!: number

  @ApiProperty({ example: 'Zona Sur', description: 'Lugar', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  lugar?: string

  @ApiProperty({ example: 1, description: 'ID categoría operativo' })
  @IsInt()
  idCategoriaOperativo!: number

  @ApiProperty({ example: 1, description: 'ID item operativo' })
  @IsInt()
  idItemOperativo!: number

  @ApiProperty({ example: 1, description: 'ID unidad' })
  @IsInt()
  idUnidad!: number

  @ApiProperty({ example: 1, description: 'ID distrital' })
  @IsInt()
  idDistrital!: number

  @ApiProperty({ example: 1, description: 'ID grupo' })
  @IsInt()
  idGrupo!: number

  @ApiProperty({ example: 'Mayor Pérez', description: 'Mando', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  mando?: string

  @ApiProperty({ example: 'Operativo realizado sin novedades', description: 'Descripción', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string
}
