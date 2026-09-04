import { PartialType } from '@nestjs/swagger';
import { CreateSituacionJuridicaBienDto } from './create-situacion_juridica_bien.dto';

export class UpdateSituacionJuridicaBienDto extends PartialType(CreateSituacionJuridicaBienDto) {}
