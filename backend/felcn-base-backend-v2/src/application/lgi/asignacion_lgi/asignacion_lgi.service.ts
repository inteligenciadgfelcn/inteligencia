import { Injectable } from '@nestjs/common'
import { CreateAsignacionLgiDto } from './dto/create-asignacion_lgi.dto'
import { UpdateAsignacionLgiDto } from './dto/update-asignacion_lgi.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { AsignacionLgiRepository } from './repository/asignacion_lgi.repository'

@Injectable()
export class AsignacionLgiService {
   constructor(
    private readonly asignacionLgiRepository: AsignacionLgiRepository,
  ) {}
  create(createAsignacionLgiDto: CreateAsignacionLgiDto) {
    return 'This action adds a new asignacionLgi'
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    return await this.asignacionLgiRepository.findAllPaginado(pagination)
  }

  findOne(id: number) {
    return `This action returns a #${id} asignacionLgi`
  }

  update(id: number, updateAsignacionLgiDto: UpdateAsignacionLgiDto) {
    return `This action updates a #${id} asignacionLgi`
  }

  remove(id: number) {
    return `This action removes a #${id} asignacionLgi`
  }
}
