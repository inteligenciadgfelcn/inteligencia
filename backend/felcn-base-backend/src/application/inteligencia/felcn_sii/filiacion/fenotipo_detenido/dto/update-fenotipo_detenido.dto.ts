import { PartialType } from '@nestjs/swagger';
import { CreateFenotipoDetenidoDto } from './create-fenotipo_detenido.dto';

export class UpdateFenotipoDetenidoDto extends PartialType(CreateFenotipoDetenidoDto) {}
