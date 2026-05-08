import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateInvestigacionParalelaDto {
  @ApiProperty()
  @IsString()
  idCaso: string

  @ApiProperty()
  @IsString()
  @MaxLength(2)
  idDepartamentoCaso: string

  @ApiProperty()
  @IsString()
  @MaxLength(3)
  abreviaturaUnidad: string

  @ApiProperty()
  @IsNumber()
  idDistrital: number

  @ApiProperty()
  @IsNumber()
  idGrupo: number

  @ApiProperty()
  @IsString()
  @MaxLength(35)
  delito: string

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  numeroCaso: string

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  asignadoCaso: string

  @ApiProperty()
  @IsString()
  @MaxLength(70)
  fiscalAsignadoCaso: string

  @ApiProperty()
  @IsString()
  idOperativo: string

  @ApiProperty()
  @IsString()
  delitoPrecedente: string

  @ApiProperty()
  @IsString()
  informe: string

  @ApiProperty()
  @IsDateString()
  fechaEnvioInvestigacionParalela: Date

  @ApiProperty()
  @IsBoolean()
  resultado: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fechaRespuestaInvestigacionParalela?: Date

  @ApiProperty()
  @IsBoolean()
  respuestaInvestigacionParalela: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  usuario: string
}
