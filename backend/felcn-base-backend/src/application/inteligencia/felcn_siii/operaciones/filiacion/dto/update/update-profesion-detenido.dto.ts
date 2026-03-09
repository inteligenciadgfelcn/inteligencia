import { PartialType } from '@nestjs/swagger'
import { CreateProfesionDetenidoDto } from '../create/profesion-detenido.dto';

export class UpdateProfesionDetenidoDto extends PartialType(CreateProfesionDetenidoDto) {}