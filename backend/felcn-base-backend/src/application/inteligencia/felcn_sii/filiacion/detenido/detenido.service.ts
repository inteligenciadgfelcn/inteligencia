import { Injectable } from '@nestjs/common';
import { CreateDetenidoDto } from './dto/create-detenido.dto';
import { UpdateDetenidoDto } from './dto/update-detenido.dto';

@Injectable()
export class DetenidoService {
  create(createDetenidoDto: CreateDetenidoDto) {
    return 'This action adds a new detenido';
  }

  findAll() {
    return `This action returns all detenido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detenido`;
  }

  update(id: number, updateDetenidoDto: UpdateDetenidoDto) {
    return `This action updates a #${id} detenido`;
  }

  remove(id: number) {
    return `This action removes a #${id} detenido`;
  }
}
