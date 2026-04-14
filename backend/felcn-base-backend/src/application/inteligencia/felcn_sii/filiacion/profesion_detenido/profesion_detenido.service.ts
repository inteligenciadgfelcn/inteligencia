import { Injectable } from '@nestjs/common'
import { CreateProfesionDetenidoDto } from './dto/create-profesion_detenido.dto'
import { UpdateProfesionDetenidoDto } from './dto/update-profesion_detenido.dto'

@Injectable()
export class ProfesionDetenidoService {
  create(createProfesionDetenidoDto: CreateProfesionDetenidoDto) {
    return 'This action adds a new profesionDetenido'
  }

  findAll() {
    return `This action returns all profesionDetenido`
  }

  findOne(id: number) {
    return `This action returns a #${id} profesionDetenido`
  }

  update(id: number, updateProfesionDetenidoDto: UpdateProfesionDetenidoDto) {
    return `This action updates a #${id} profesionDetenido`
  }

  remove(id: number) {
    return `This action removes a #${id} profesionDetenido`
  }
}
