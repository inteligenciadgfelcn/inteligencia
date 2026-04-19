import { Injectable } from '@nestjs/common';
import { CreateArrestadoAuxiliarDto } from './dto/create-arrestado_auxiliar.dto';
import { UpdateArrestadoAuxiliarDto } from './dto/update-arrestado_auxiliar.dto';

@Injectable()
export class ArrestadoAuxiliarService {
  create(createArrestadoAuxiliarDto: CreateArrestadoAuxiliarDto) {
    return 'This action adds a new arrestadoAuxiliar';
  }

  findAll() {
    return `This action returns all arrestadoAuxiliar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} arrestadoAuxiliar`;
  }

  update(id: number, updateArrestadoAuxiliarDto: UpdateArrestadoAuxiliarDto) {
    return `This action updates a #${id} arrestadoAuxiliar`;
  }

  remove(id: number) {
    return `This action removes a #${id} arrestadoAuxiliar`;
  }
}
