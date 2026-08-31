import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CalidadBienLgi} from '../entities/calidad-bien.entity'

@Injectable()
export class CalidadBienLgiRepository {
  constructor(
    @InjectRepository(CalidadBienLgi, DB_LGI)
    private readonly repository: Repository<CalidadBienLgi>,
  ) {}

  create(data: Partial<CalidadBienLgi>) {
    return this.repository.create(data)
  }

  save(data: CalidadBienLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        calbId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        calbId: id,
      },
    })
  }
}