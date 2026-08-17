import { PartialType } from '@nestjs/swagger';
import { CreateSituacionJuridicaDto } from './create-situacion_juridica.dto';

export class UpdateSituacionJuridicaDto extends PartialType(CreateSituacionJuridicaDto) {}
