import { CreateDetenidoAuxiliarDto } from './create/detenido-auxiliar.dto'
import { CreateAliasDetenidoDto } from './create/alias-detenido.dto'
import { CreateDocumentoDetenidoDto } from './create/documento-detenido.dto'
import { CreateFenotipoDetenidoDto } from './create/fenotipo-detenido.dto'
import { CreateProfesionDetenidoDto } from './create/profesion-detenido.dto'

export class CreateFiliacionDto {
    detenido:CreateDetenidoAuxiliarDto
    alias: CreateAliasDetenidoDto
    profesion:CreateProfesionDetenidoDto
    documento: CreateDocumentoDetenidoDto
    fenotipo: CreateFenotipoDetenidoDto
}
