import { PartialType } from '@nestjs/swagger'
import { CreateArrestadoAuxiliarDto } from './create-arrestado_auxiliar.dto'

export class UpdateArrestadoAuxiliarDto extends PartialType(
  CreateArrestadoAuxiliarDto
) {}
