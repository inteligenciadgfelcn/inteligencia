import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CicloLgi } from '../entity/ciclo.entity'

@Injectable()
export class CicloLgiRepository {
  constructor(
    @InjectRepository(CicloLgi, DB_LGI)
    private readonly repository: Repository<CicloLgi>
  ) {}

  async findAllGeneral(): Promise<CicloLgi[]> {
    return this.repository.find({
      order: {
        id: 'ASC',
      },
    })
  }

  async findOne(id: string): Promise<CicloLgi | null> {
    return this.repository.findOne({
      where: { id },
    })
  }
}