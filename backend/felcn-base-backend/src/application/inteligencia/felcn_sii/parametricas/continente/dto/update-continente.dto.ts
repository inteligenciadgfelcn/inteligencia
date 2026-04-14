import { PartialType } from '@nestjs/swagger'
import { CreateContinenteDto } from './create-continente.dto'

export class UpdateContinenteDto extends PartialType(CreateContinenteDto) {}
