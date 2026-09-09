import { PartialType } from '@nestjs/swagger';
import { CreateTipoSituacionLegalBienDto } from './create-tipo_situcion_bien.dto';

export class UpdateTipoSituacionLegalBienDto extends PartialType(CreateTipoSituacionLegalBienDto) {}
