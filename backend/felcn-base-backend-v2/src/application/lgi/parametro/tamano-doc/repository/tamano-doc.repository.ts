import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { UnidadLgi } from '../entities/tamano-doc.entity'

@Injectable()
export class TamanoDocLgiRepository {
  constructor(
    @InjectRepository(UnidadLgi, DB_LGI)
    private readonly repository: Repository<UnidadLgi>,
  ) {}

  create(data: Partial<UnidadLgi>) {
    return this.repository.create(data)
  }

  save(unidad: UnidadLgi) {
    return this.repository.save(unidad)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        tamdocId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        tamdocId: id,
      },
    })
  }
}