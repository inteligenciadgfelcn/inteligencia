import { PartialType } from '@nestjs/swagger'
import { CreateParentezcoDto } from './create-parentezco.dto'

export class UpdateParentezcoDto extends PartialType(CreateParentezcoDto) {}
