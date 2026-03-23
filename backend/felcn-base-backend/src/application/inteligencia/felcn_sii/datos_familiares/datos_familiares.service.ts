import { Injectable } from '@nestjs/common';
import { CreateDatosFamiliareDto } from './dto/create-datos_familiare.dto';
import { UpdateDatosFamiliareDto } from './dto/update-datos_familiare.dto';

@Injectable()
export class DatosFamiliaresService {
  create(createDatosFamiliareDto: CreateDatosFamiliareDto) {
    return 'This action adds a new datosFamiliare';
  }

  findAll() {
    return `This action returns all datosFamiliares`;
  }

  findOne(id: number) {
    return `This action returns a #${id} datosFamiliare`;
  }

  update(id: number, updateDatosFamiliareDto: UpdateDatosFamiliareDto) {
    return `This action updates a #${id} datosFamiliare`;
  }

  remove(id: number) {
    return `This action removes a #${id} datosFamiliare`;
  }
}
