import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { TipoPersonaLgi} from '../entities/tipo-persona.entity'

@Injectable()
export class TipoPersonaLgiRepository {
  constructor(
    @InjectRepository(TipoPersonaLgi, DB_LGI)
    private readonly repository: Repository<TipoPersonaLgi>,
  ) {}

  create(data: Partial<TipoPersonaLgi>) {
    return this.repository.create(data)
  }

  save(data: TipoPersonaLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        tpId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        tpId: id,
      },
    })
  }
}