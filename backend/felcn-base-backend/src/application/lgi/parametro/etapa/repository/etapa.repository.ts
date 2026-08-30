import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { EtapaLgi} from '../entities/etapa.entity'

@Injectable()
export class EtapaLgiRepository {
  constructor(
    @InjectRepository(EtapaLgi, DB_LGI)
    private readonly repository: Repository<EtapaLgi>,
  ) {}

  create(data: Partial<EtapaLgi>) {
    return this.repository.create(data)
  }

  save(data: EtapaLgi) {
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