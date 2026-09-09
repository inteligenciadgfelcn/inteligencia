import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { TipoSituacionLegalBien } from '../entities/tipo_situcion_bien.entity'

@Injectable()
export class TipoSituacionLegalBienLgiRepository {
  constructor(
    @InjectRepository(TipoSituacionLegalBien, DB_LGI)
    private readonly repository: Repository<TipoSituacionLegalBien>,
  ) {}

  create(data: Partial<TipoSituacionLegalBien>) {
    return this.repository.create(data)
  }

  save(data: TipoSituacionLegalBien) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        etId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        etId: id,
      },
    })
  }
}