import { PartialType } from '@nestjs/swagger';
import { CreateContenidoBienDto } from './create-contenido-bien.dto';

export class UpdateContenidoBienDto extends PartialType(CreateContenidoBienDto) {}
