import { PartialType } from '@nestjs/swagger';
import { CreateNombresSupuestoDto } from './create-nombres_supuesto.dto';

export class UpdateNombresSupuestoDto extends PartialType(CreateNombresSupuestoDto) {}
