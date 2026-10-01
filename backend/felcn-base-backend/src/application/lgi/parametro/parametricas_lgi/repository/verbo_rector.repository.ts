import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { VerboRectorLgi } from '../entity/verbo-rector.entity'

@Injectable()
export class VerboRectorLgiRepository {
  constructor(
    @InjectRepository(VerboRectorLgi, DB_LGI)
    private readonly repository: Repository<VerboRectorLgi>
  ) {}

  async findAllGeneral(): Promise<VerboRectorLgi[]> {
    return this.repository.find({
      order: {
        id: 'ASC',
      },
    })
  }

  async findOne(id: string): Promise<VerboRectorLgi | null> {
    return this.repository.findOne({
      where: { id },
    })
  }
}