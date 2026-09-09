import { PartialType } from '@nestjs/swagger'
import { CreatePersonasJuridicaDto } from './create-personas_juridica.dto'

export class UpdatePersonasJuridicaDto extends PartialType(
  CreatePersonasJuridicaDto
) {}
