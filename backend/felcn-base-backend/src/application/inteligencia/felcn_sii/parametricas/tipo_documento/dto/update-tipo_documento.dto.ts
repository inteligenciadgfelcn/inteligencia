import { PartialType } from '@nestjs/swagger';
import { CreateTipoDocumentoDto } from './create-tipo_documento.dto';

export class UpdateTipoDocumentoDto extends PartialType(CreateTipoDocumentoDto) {}
