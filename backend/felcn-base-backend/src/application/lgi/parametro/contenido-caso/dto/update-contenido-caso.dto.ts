import { PartialType } from '@nestjs/swagger';
import { CreateContenidoCasoDto } from './create-contenido-caso.dto';

export class UpdateContenidoCasoDto extends PartialType(CreateContenidoCasoDto) {}
