import { PartialType } from '@nestjs/swagger';
import { CreateInicioCasoDto } from './create-inicio-caso.dto';

export class UpdateInicioCasoDto extends PartialType(CreateInicioCasoDto) {}
