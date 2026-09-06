import {
  PartialType,
} from '@nestjs/swagger'
import { CreateBienSecuestadoDto } from './create-bien-secuestrado.dto'

export class UpdateBienSecuestradoDto
  extends PartialType(
    CreateBienSecuestadoDto,
  ) {}