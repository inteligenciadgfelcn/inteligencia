import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { CreateFiliacionDto } from './create-filiacion.dto'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { UpdateAliasDetenidoDto } from '../alias_detenido/dto/update-alias_detenido.dto'
import { UpdateDocumentoDetenidoDto } from '../documento_detenido/dto/update-documento_detenido.dto'
import { UpdateFenotipoDetenidoDto } from '../fenotipo_detenido/dto/update-fenotipo_detenido.dto'
import { UpdateProfesionDetenidoDto } from '../profesion_detenido/dto/update-profesion_detenido.dto'
import { UpdateDetenidoDto } from '../detenido/dto/update-detenido.dto'

export class UpdateFiliacionDto extends PartialType(CreateFiliacionDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateDetenidoDto)
  detenidoUpdate?: UpdateDetenidoDto

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAliasDetenidoDto)
  aliasUpdate?: UpdateAliasDetenidoDto

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateDocumentoDetenidoDto)
  documentoUpdate?: UpdateDocumentoDetenidoDto

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateFenotipoDetenidoDto)
  fenotipoUpdate?: UpdateFenotipoDetenidoDto

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProfesionDetenidoDto)
  profesionUpdate?: UpdateProfesionDetenidoDto
}
