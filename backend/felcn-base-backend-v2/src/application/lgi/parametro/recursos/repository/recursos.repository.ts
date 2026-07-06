import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { RecursosLgi} from '../entities/recursos.entity'

@Injectable()
export class RecursosLgiRepository {
  constructor(
    @InjectRepository(RecursosLgi, DB_LGI)
    private readonly repository: Repository<RecursosLgi>,
  ) {}

  create(data: Partial<RecursosLgi>) {
    return this.repository.create(data)
  }

  save(data: RecursosLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        recId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        recId: id,
      },
    })
  }
}