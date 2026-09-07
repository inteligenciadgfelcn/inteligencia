import { PartialType } from '@nestjs/swagger';
import { CreateCaracteristicasBieneDto } from './create-caracteristicas_biene.dto';

export class UpdateCaracteristicasBieneDto extends PartialType(CreateCaracteristicasBieneDto) {}
