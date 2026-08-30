import { PartialType } from '@nestjs/swagger';
import { CreateTamanoDocDto } from './create-tamano-doc.dto';

export class UpdateTamanoDocDto extends PartialType(CreateTamanoDocDto) {}
