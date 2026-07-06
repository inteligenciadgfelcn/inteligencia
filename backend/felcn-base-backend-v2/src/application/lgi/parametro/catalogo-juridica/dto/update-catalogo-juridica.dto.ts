import { PartialType } from '@nestjs/swagger';
import { CreateCatalogoJuridicaDto } from './create-catalogo-juridica.dto';

export class UpdateCatalogoJuridicaDto extends PartialType(CreateCatalogoJuridicaDto) {}
