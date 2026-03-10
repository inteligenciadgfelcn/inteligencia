import { CreateAliasDetenidoDto } from '../alias_detenido/dto/create-alias_detenido.dto'
import { CreateDetenidoDto } from '../detenido/dto/create-detenido.dto'
import { CreateDocumentoDetenidoDto } from '../documento_detenido/dto/create-documento_detenido.dto'
import { CreateFenotipoDetenidoDto } from '../fenotipo_detenido/dto/create-fenotipo_detenido.dto'
import { CreateProfesionDetenidoDto } from '../profesion_detenido/dto/create-profesion_detenido.dto'

export class CreateFiliacionDto {
  detenido: CreateDetenidoDto
  alias: CreateAliasDetenidoDto
  profesion: CreateProfesionDetenidoDto
  documento: CreateDocumentoDetenidoDto
  fenotipo: CreateFenotipoDetenidoDto
}
