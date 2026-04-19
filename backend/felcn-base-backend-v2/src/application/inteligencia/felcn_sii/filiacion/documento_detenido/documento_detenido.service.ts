import { Injectable } from '@nestjs/common';
import { CreateDocumentoDetenidoDto } from './dto/create-documento_detenido.dto';
import { UpdateDocumentoDetenidoDto } from './dto/update-documento_detenido.dto';

@Injectable()
export class DocumentoDetenidoService {
  create(createDocumentoDetenidoDto: CreateDocumentoDetenidoDto) {
    return 'This action adds a new documentoDetenido';
  }

  findAll() {
    return `This action returns all documentoDetenido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentoDetenido`;
  }

  update(id: number, updateDocumentoDetenidoDto: UpdateDocumentoDetenidoDto) {
    return `This action updates a #${id} documentoDetenido`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentoDetenido`;
  }
}
