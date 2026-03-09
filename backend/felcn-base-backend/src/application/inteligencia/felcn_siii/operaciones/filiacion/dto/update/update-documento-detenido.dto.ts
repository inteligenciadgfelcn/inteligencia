import { PartialType } from '@nestjs/swagger'
import { CreateDocumentoDetenidoDto } from '../create/documento-detenido.dto';

export class UpdateDocumentoDetenidoDto extends PartialType(CreateDocumentoDetenidoDto) {}