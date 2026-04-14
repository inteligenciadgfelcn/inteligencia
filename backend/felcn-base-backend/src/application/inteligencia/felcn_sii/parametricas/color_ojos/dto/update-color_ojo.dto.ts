import { PartialType } from '@nestjs/swagger'
import { CreateColorOjoDto } from './create-color_ojo.dto'

export class UpdateColorOjoDto extends PartialType(CreateColorOjoDto) {}
