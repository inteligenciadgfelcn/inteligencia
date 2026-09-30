import { PartialType } from '@nestjs/swagger';
import { CreateConclusionCasoDto } from './create-conclusion_caso.dto';

export class UpdateConclusionCasoDto extends PartialType(CreateConclusionCasoDto) {}
