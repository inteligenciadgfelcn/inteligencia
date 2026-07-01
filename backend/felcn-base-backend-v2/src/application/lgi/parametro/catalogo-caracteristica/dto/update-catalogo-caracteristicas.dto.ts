import { PartialType } from '@nestjs/swagger';
import { CreateCatalogoCaracteristicasDto } from './create-catalogo-caracteristica.dto';

export class UpdateCatalogoCaracteristicaDto extends PartialType(CreateCatalogoCaracteristicasDto) {}
