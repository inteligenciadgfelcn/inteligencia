import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { BienesLgi } from '../entities/biene.entity'

@Injectable()
export class BienesLgiRepository {
  constructor(
    @InjectRepository(BienesLgi, DB_LGI)
    private readonly repository: Repository<BienesLgi>,
  ) {}

  create(data: Partial<BienesLgi>) {
    return this.repository.create(data)
  }

  save(unidad: BienesLgi) {
    return this.repository.save(unidad)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        bienId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        bienId: id,
      },
    })
  }
}