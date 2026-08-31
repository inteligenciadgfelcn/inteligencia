import { PartialType } from '@nestjs/swagger';
import { CreateTipoVinculoDto } from './create-tipo-vinculo.dto';

export class UpdatipoVinculoDto extends PartialType(CreateTipoVinculoDto) {}
