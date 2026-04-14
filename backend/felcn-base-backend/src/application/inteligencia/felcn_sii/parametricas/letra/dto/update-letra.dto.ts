import { PartialType } from '@nestjs/swagger'
import { CreateLetraDto } from './create-letra.dto'

export class UpdateLetraDto extends PartialType(CreateLetraDto) {}
