import { PartialType } from '@nestjs/swagger';
import { CreateFiliacionDto } from './create-filiacion.dto';

export class UpdateFiliacionDto extends PartialType(CreateFiliacionDto) {}
