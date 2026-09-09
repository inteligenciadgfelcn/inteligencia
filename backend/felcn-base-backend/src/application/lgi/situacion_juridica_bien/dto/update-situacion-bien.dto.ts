import {
  PartialType,
} from '@nestjs/swagger'
import {
  CreateSituacionBienDto,
} from './create-situacion-bien.dto'

export class UpdateSituacionBienDto
  extends PartialType(
    CreateSituacionBienDto,
  ) {}