import { PartialType } from '@nestjs/swagger'
import { CreateDetenidoAuxiliarDto } from '../create/detenido-auxiliar.dto';

export class UpdateDetenidoAuxiliarDto extends PartialType(CreateDetenidoAuxiliarDto) {}