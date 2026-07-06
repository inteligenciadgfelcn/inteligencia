import { PartialType } from '@nestjs/swagger';
import { CreateCalidadBienDto } from './create-calidad-bien.dto';

export class UpdateCalidadBienDto extends PartialType(CreateCalidadBienDto) {}
