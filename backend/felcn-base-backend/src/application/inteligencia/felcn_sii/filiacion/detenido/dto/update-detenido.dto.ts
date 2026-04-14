import { PartialType } from '@nestjs/swagger'
import { CreateDetenidoDto } from './create-detenido.dto'

export class UpdateDetenidoDto extends PartialType(CreateDetenidoDto) {}
