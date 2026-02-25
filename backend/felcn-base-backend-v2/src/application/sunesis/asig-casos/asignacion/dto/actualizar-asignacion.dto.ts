import { PartialType } from '@nestjs/swagger'
import { CrearAsignacionDto } from './crear-asignacion.dto'

export class ActualizarAsignacionDto extends PartialType(CrearAsignacionDto) {}
