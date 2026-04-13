import { Injectable } from '@nestjs/common'
import { CreateOperativoDto } from './dto/create-operativo.dto'
import { UpdateOperativoDto } from './dto/update-operativo.dto'
import { AuthRepository } from './repositories/auth.repository'
import { SiiiRepository } from './repositories/siii.repository'

@Injectable()
export class OperativoService {
  constructor(
     private readonly siiiRepo: SiiiRepository,
    private readonly authRepo: AuthRepository
  ) {}

  create(createOperativoDto: CreateOperativoDto) {
    return 'This action adds a new operativo'
  }

  findAll() {
    return `This action returns all operativo`
  }

  async findOne(numero_caso: string) {
    const limpio = decodeURIComponent(numero_caso).trim()

    const result = await this.siiiRepo.getOperativoByCaso(limpio)

    if (!result.length) return null

    const operativo = result[0]

    const auth = await this.authRepo.getEstructura(
      operativo.id_unidad,
      operativo.id_distrital,
      operativo.id_grupo
    )

    return {
      ...operativo,
      unidad: auth.unidad || null,
      distrital: auth.distrital || null,
      grupo: auth.grupo || null,
    }
  }

  update(id: number, updateOperativoDto: UpdateOperativoDto) {
    return `This action updates a #${id} operativo`
  }

  remove(id: number) {
    return `This action removes a #${id} operativo`
  }
}