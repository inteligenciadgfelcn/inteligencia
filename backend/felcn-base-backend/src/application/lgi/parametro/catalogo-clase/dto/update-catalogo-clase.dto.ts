import { PartialType } from '@nestjs/swagger';
import { CreateCatalogoClaseDto } from './create-catalogo-clase.dto';

export class UpdateCatalogoDto extends PartialType(CreateCatalogoClaseDto) {}
