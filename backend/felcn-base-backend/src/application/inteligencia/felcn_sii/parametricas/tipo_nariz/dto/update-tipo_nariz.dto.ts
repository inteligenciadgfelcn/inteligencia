import { PartialType } from '@nestjs/swagger'
import { CreateTipoNarizDto } from './create-tipo_nariz.dto'

export class UpdateTipoNarizDto extends PartialType(CreateTipoNarizDto) {}
