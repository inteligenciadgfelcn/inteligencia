import { PartialType } from '@nestjs/swagger';
import { CreatePersonasJuridicasPdDto } from './create-personas_juridicas_pd.dto';

export class UpdatePersonasJuridicasPdDto extends PartialType(CreatePersonasJuridicasPdDto) {}
