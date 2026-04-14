import { PartialType } from '@nestjs/swagger'
import { CreateAliasDetenidoDto } from './create-alias_detenido.dto'

export class UpdateAliasDetenidoDto extends PartialType(
  CreateAliasDetenidoDto
) {}
