import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { UpdateAliasDetenidoDto } from './update/update-alias-detenido.dto'
import { UpdateDetenidoAuxiliarDto } from './update/update-detenido-auxiliat.dto'
import { UpdateDocumentoDetenidoDto } from './update/update-documento-detenido.dto'
import { UpdateFenotipoDetenidoDto } from './update/update-fenotipodetenido.dto'
import { UpdateProfesionDetenidoDto } from './update/update-profesion-detenido.dto'

export class UpdateFiliacionDto {

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateDetenidoAuxiliarDto)
  detenido?: UpdateDetenidoAuxiliarDto


  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAliasDetenidoDto)
  alias?: UpdateAliasDetenidoDto


  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateDocumentoDetenidoDto)
  documento?: UpdateDocumentoDetenidoDto


  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateFenotipoDetenidoDto)
  fenotipo?: UpdateFenotipoDetenidoDto


  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProfesionDetenidoDto)
  profesion?: UpdateProfesionDetenidoDto
}