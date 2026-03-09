import { PartialType } from '@nestjs/swagger'
import { CreateFenotipoDetenidoDto } from '../create/fenotipo-detenido.dto';

export class UpdateFenotipoDetenidoDto extends PartialType(CreateFenotipoDetenidoDto) {}