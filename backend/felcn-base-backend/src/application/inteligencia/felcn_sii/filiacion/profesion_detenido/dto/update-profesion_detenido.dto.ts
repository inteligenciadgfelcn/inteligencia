import { PartialType } from '@nestjs/swagger'
import { CreateProfesionDetenidoDto } from './create-profesion_detenido.dto'

export class UpdateProfesionDetenidoDto extends PartialType(
  CreateProfesionDetenidoDto
) {}
