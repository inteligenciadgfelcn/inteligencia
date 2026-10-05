import { PartialType } from '@nestjs/swagger';
import { CreateSituacionJuridicaPdDto } from './create-situacion_juridica_pd.dto';

export class UpdateSituacionJuridicaPdDto extends PartialType(CreateSituacionJuridicaPdDto) {}
