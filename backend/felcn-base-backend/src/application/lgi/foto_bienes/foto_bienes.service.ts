import { Injectable } from '@nestjs/common';
import { CreateFotoBieneDto } from './dto/create-foto_biene.dto';
import { UpdateFotoBieneDto } from './dto/update-foto_biene.dto';

@Injectable()
export class FotoBienesService {
  create(createFotoBieneDto: CreateFotoBieneDto) {
    return 'This action adds a new fotoBiene';
  }

  findAll() {
    return `This action returns all fotoBienes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fotoBiene`;
  }

  update(id: number, updateFotoBieneDto: UpdateFotoBieneDto) {
    return `This action updates a #${id} fotoBiene`;
  }

  remove(id: number) {
    return `This action removes a #${id} fotoBiene`;
  }
}
