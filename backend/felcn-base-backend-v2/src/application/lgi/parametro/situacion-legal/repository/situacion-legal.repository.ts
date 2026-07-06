import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { SituacionLegalLgi} from '../entities/situacion-legal.entity'

@Injectable()
export class SituacionLegalLgiRepository {
  constructor(
    @InjectRepository(SituacionLegalLgi, DB_LGI)
    private readonly repository: Repository<SituacionLegalLgi>,
  ) {}

  create(data: Partial<SituacionLegalLgi>) {
    return this.repository.create(data)
  }

  save(data: SituacionLegalLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        slId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        slId: id,
      },
    })
  }
}