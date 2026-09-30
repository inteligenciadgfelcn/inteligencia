import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { TipologiaLgi } from '../entity/tipologia.entity'

@Injectable()
export class TipologiaLgiRepository {
  constructor(
    @InjectRepository(TipologiaLgi, DB_LGI)
    private readonly repository: Repository<TipologiaLgi>
  ) {}

  async findAllGeneral(): Promise<TipologiaLgi[]> {
    return this.repository.find({
      order: {
        descripcion: 'ASC',
        id: 'ASC',
      },
    })
  }

  async findOne(id: string): Promise<TipologiaLgi | null> {
    return this.repository.findOne({
      where: { id },
    })
  }
}