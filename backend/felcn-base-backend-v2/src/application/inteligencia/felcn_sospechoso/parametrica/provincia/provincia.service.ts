import { Get, Injectable, NotFoundException } from '@nestjs/common'
import { DB_SOSPECHOSO } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Departamento } from './entities/departamento.entity'
import { Provincia } from './entities/provincia.entity'

@Injectable()
export class ProvinciaService {
  constructor(
    @InjectRepository(Provincia, DB_SOSPECHOSO)
    private readonly provinciaRepository: Repository<Provincia>,

    @InjectRepository(Departamento, DB_SOSPECHOSO)
    private readonly departamentoRepository: Repository<Departamento>
  ) {}

  findAll() {
    return this.provinciaRepository.find({
      order: {
        descripcion: 'ASC',
      },
    })
  }

  async findByDepartamentoAbrev(abrev: string) {
    const abrevClean = abrev.trim().toUpperCase()

    // Buscar departamento
    const departamento = await this.departamentoRepository.findOne({
      where: { abreviatura: abrevClean },
    })

    if (!departamento) {
      throw new NotFoundException(
        `No existe departamento con abreviatura ${abrevClean}`
      )
    }

    // Buscar provincias
    return this.provinciaRepository.find({
      where: { idDepartamento: departamento.idDepartamento },
      relations: ['departamento'],
      order: { descripcion: 'ASC' },
    })
  }
}
