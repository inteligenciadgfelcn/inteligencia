import { PartialType } from '@nestjs/swagger'
import { CreateBienIncautadoDto } from './create-bien-incautado.dto'

export class UpdateBienIncautadoDto extends PartialType(
  CreateBienIncautadoDto
) {}
