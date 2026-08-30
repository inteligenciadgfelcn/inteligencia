import { Injectable } from '@nestjs/common'
import { DB_SOSPECHOSO } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GrupoSospechoso } from './entities/grupo-sospechoso.entity'

@Injectable()
export class GrupoSospechosoService {
  constructor(
    @InjectRepository(GrupoSospechoso, DB_SOSPECHOSO)
    private readonly grupoRepository: Repository<GrupoSospechoso>
  ) {}
  
  async findAll(): Promise<GrupoSospechoso[]> {
    return await this.grupoRepository.find()
  }

  async findByDistrital(idDistrital: number) {
    return await this.grupoRepository
      .createQueryBuilder('g')
      .where('g.id_distrital = :idDistrital', { idDistrital })
      .getMany()
  }
}
