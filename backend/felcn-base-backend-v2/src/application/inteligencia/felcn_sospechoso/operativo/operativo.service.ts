import { Injectable } from '@nestjs/common'
import { CreateOperativoDto } from './dto/create-operativo.dto'
import { UpdateOperativoDto } from './dto/update-operativo.dto'
import { AuthRepository } from './repositories/auth.repository'
import { SiiiRepository } from './repositories/siii.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Operativo } from './entities/operativo.entity'
import { DB_SOSPECHOSO } from '@/core/config/database/database.module'
import { Departamento } from '../parametrica/provincia/entities/departamento.entity'

@Injectable()
export class OperativoService {
  constructor(
    private readonly siiiRepo: SiiiRepository,
    private readonly authRepo: AuthRepository,

    @InjectRepository(Operativo, DB_SOSPECHOSO)
    private readonly operativoRepo: Repository<Operativo>,

    @InjectRepository(Departamento, DB_SOSPECHOSO)
    private readonly departamentoRepo: Repository<Departamento>
  ) {}

  async create(dto: CreateOperativoDto) {
    const abrev = dto.idDepartamento?.trim().toUpperCase()

    if (!abrev) {
      throw new Error('La abreviatura es requerida')
    }

    const departamento = await this.departamentoRepo.findOne({
      where: { abreviatura: abrev },
    })

    if (!departamento) {
      throw new Error(`Departamento ${abrev} no existe`)
    }

    const operativo = this.operativoRepo.create({
      ...dto,
      idDepartamento: departamento.idDepartamento,
    })

    return await this.operativoRepo.save(operativo)
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
