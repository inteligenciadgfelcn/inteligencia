import { PartialType } from '@nestjs/swagger'
import { CreateColorPielDto } from './create-color_piel.dto'

export class UpdateColorPielDto extends PartialType(CreateColorPielDto) {}
