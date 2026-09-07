import { PartialType } from '@nestjs/swagger'
import { CreateBienConfiscadoDto } from './create-bien-confiscado.dto'

export class UpdateBienConfiscadoDto extends PartialType(
  CreateBienConfiscadoDto
) {}
