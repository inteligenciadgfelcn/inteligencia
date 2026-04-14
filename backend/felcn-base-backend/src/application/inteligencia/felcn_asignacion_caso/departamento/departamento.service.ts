import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_ASIG_CASOS } from '@/core/config/database/database.module'
import { Departamento } from './entities/departamento.entity'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectRepository(Departamento, DB_ASIG_CASOS)
    private readonly departamentoRepository: Repository<Departamento>
  ) {}

  async findAll(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro } = pagination
    const query = this.departamentoRepository
      .createQueryBuilder('departamento')
      .leftJoinAndSelect('departamento.pais', 'pais')
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere('departamento.descripcion ILIKE :filtro', {
        filtro: `%${filtro}%`,
      })
    }

    return await query.getManyAndCount()
  }

  async findAllGeneral(): Promise<Departamento[]> {
    return this.departamentoRepository.find()
  }

  async findAllPais(): Promise<Departamento[]> {
    return await this.departamentoRepository.find()
  }

  async findOne(id: number): Promise<Departamento> {
    const departamento = await this.departamentoRepository.findOne({
      where: { idDepartamento: id },
    })

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado')
    }

    return departamento
  }
}
