import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { CreateAliasDetenidoDto } from '../alias_detenido/dto/create-alias_detenido.dto'
import { CreateDetenidoDto } from '../detenido/dto/create-detenido.dto'
import { CreateDocumentoDetenidoDto } from '../documento_detenido/dto/create-documento_detenido.dto'
import { CreateFenotipoDetenidoDto } from '../fenotipo_detenido/dto/create-fenotipo_detenido.dto'
import { CreateProfesionDetenidoDto } from '../profesion_detenido/dto/create-profesion_detenido.dto'

export class CreateFiliacionDto {
  @ApiProperty({ type: CreateDetenidoDto })
  @ValidateNested()
  @Type(() => CreateDetenidoDto)
  detenido: CreateDetenidoDto


  @ApiProperty({ type: CreateAliasDetenidoDto })
  @ValidateNested()
  @Type(() => CreateAliasDetenidoDto)
  alias: CreateAliasDetenidoDto


  @ApiProperty({ type: CreateProfesionDetenidoDto })
  @ValidateNested()
  @Type(() => CreateProfesionDetenidoDto)
  profesion: CreateProfesionDetenidoDto


  @ApiProperty({ type: CreateDocumentoDetenidoDto })
  @ValidateNested()
  @Type(() => CreateDocumentoDetenidoDto)
  documento: CreateDocumentoDetenidoDto


  @ApiProperty({ type: CreateFenotipoDetenidoDto })
  @ValidateNested()
  @Type(() => CreateFenotipoDetenidoDto)
  fenotipo: CreateFenotipoDetenidoDto
}
