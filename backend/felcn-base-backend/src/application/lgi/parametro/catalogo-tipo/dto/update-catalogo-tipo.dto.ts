import { PartialType } from '@nestjs/swagger';
import { CreateCatalogoTipoDto } from './create-catalogo-tipo.dto';

export class UpdateCatalogoTipoDto extends PartialType(CreateCatalogoTipoDto) {}
