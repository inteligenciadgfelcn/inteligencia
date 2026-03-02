import { Injectable } from '@nestjs/common';
import { CreateContinenteDto } from './dto/create-continente.dto';
import { UpdateContinenteDto } from './dto/update-continente.dto';

@Injectable()
export class ContinenteService {
  create(createContinenteDto: CreateContinenteDto) {
    return 'This action adds a new continente';
  }

  findAll() {
    return `This action returns all continente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} continente`;
  }

  update(id: number, updateContinenteDto: UpdateContinenteDto) {
    return `This action updates a #${id} continente`;
  }

  remove(id: number) {
    return `This action removes a #${id} continente`;
  }
}
