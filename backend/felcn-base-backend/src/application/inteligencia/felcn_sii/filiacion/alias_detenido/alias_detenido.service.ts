import { Injectable } from '@nestjs/common';
import { CreateAliasDetenidoDto } from './dto/create-alias_detenido.dto';
import { UpdateAliasDetenidoDto } from './dto/update-alias_detenido.dto';

@Injectable()
export class AliasDetenidoService {
  create(createAliasDetenidoDto: CreateAliasDetenidoDto) {
    return 'This action adds a new aliasDetenido';
  }

  findAll() {
    return `This action returns all aliasDetenido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aliasDetenido`;
  }

  update(id: number, updateAliasDetenidoDto: UpdateAliasDetenidoDto) {
    return `This action updates a #${id} aliasDetenido`;
  }

  remove(id: number) {
    return `This action removes a #${id} aliasDetenido`;
  }
}
