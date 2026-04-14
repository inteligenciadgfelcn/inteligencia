import { Injectable } from '@nestjs/common'
import { CreateFenotipoDetenidoDto } from './dto/create-fenotipo_detenido.dto'
import { UpdateFenotipoDetenidoDto } from './dto/update-fenotipo_detenido.dto'

@Injectable()
export class FenotipoDetenidoService {
  create(createFenotipoDetenidoDto: CreateFenotipoDetenidoDto) {
    return 'This action adds a new fenotipoDetenido'
  }

  findAll() {
    return `This action returns all fenotipoDetenido`
  }

  findOne(id: number) {
    return `This action returns a #${id} fenotipoDetenido`
  }

  update(id: number, updateFenotipoDetenidoDto: UpdateFenotipoDetenidoDto) {
    return `This action updates a #${id} fenotipoDetenido`
  }

  remove(id: number) {
    return `This action removes a #${id} fenotipoDetenido`
  }
}
