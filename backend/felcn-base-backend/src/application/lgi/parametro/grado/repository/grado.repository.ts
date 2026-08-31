import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { GradoLgi} from '../entities/grado.entity'

@Injectable()
export class GradoLgiRepository {
  constructor(
    @InjectRepository(GradoLgi, DB_LGI)
    private readonly repository: Repository<GradoLgi>,
  ) {}

  create(data: Partial<GradoLgi>) {
    return this.repository.create(data)
  }

  save(data: GradoLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        grId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        grId: id,
      },
    })
  }
}