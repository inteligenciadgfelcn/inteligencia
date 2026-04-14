import { PartialType } from '@nestjs/swagger'
import { CreateTipoOjoDto } from './create-tipo_ojo.dto'

export class UpdateTipoOjoDto extends PartialType(CreateTipoOjoDto) {}
