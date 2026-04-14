import { PartialType } from '@nestjs/swagger'
import { CreateDatosFamiliaresDto } from './create-datos_familiare.dto'

export class UpdateDatosFamiliaresDto extends PartialType(
  CreateDatosFamiliaresDto
) {}
