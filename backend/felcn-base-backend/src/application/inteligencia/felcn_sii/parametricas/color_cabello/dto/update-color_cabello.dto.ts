import { PartialType } from '@nestjs/swagger';
import { CreateColorCabelloDto } from './create-color_cabello.dto';

export class UpdateColorCabelloDto extends PartialType(CreateColorCabelloDto) {}
