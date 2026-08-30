import { PartialType } from '@nestjs/swagger';
import { CreateDocumentoDetenidoDto } from './create-documento_detenido.dto';

export class UpdateDocumentoDetenidoDto extends PartialType(CreateDocumentoDetenidoDto) {}
