import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { EstadoLgi} from '../entities/estado.entity'

@Injectable()
export class EstadoLgiRepository {
  constructor(
    @InjectRepository(EstadoLgi, DB_LGI)
    private readonly repository: Repository<EstadoLgi>,
  ) {}

  create(data: Partial<EstadoLgi>) {
    return this.repository.create(data)
  }

  save(data: EstadoLgi) {
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