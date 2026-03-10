import { Injectable } from '@nestjs/common';
import { CreateFiliacionDto } from './dto/create-filiacion.dto';
import { UpdateFiliacionDto } from './dto/update-filiacion.dto';

@Injectable()
export class FiliacionService {
  create(createFiliacionDto: CreateFiliacionDto) {
    return 'This action adds a new filiacion';
  }

  findAll() {
    return `This action returns all filiacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} filiacion`;
  }

  update(id: number, updateFiliacionDto: UpdateFiliacionDto) {
    return `This action updates a #${id} filiacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} filiacion`;
  }
}
