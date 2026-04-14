import { PartialType } from '@nestjs/swagger'
import { CreateDistritalDto } from './create-distrital.dto'

export class UpdateDistritalDto extends PartialType(CreateDistritalDto) {}
