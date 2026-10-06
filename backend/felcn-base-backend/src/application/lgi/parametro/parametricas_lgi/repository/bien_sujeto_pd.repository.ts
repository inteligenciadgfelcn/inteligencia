import { DB_LGI } from '@/core/config/database/database.module'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BienSujetoPd } from '../entity/bien_sujeto_pd.entity'

@Injectable()
export class BienSujetoPdRepository {
  constructor(
    @InjectRepository(BienSujetoPd, DB_LGI)
    private readonly repository: Repository<BienSujetoPd>
  ) {}

  async findAllGeneral(): Promise<BienSujetoPd[]> {
    return this.repository.find({
      order: {
        idBienSujetoPd: 'ASC',
      },
    })
  }

  async findOne(id: number): Promise<BienSujetoPd | null> {
    return this.repository.findOne({
      where: {
        idBienSujetoPd: id,
      },
    })
  }
}