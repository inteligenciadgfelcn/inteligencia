import { DB_LGI } from '@/core/config/database/database.module'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Sentencia } from '../entity/sentencia.entity'

@Injectable()
export class SentenciaRepository {
  constructor(
    @InjectRepository(Sentencia, DB_LGI)
    private readonly repository: Repository<Sentencia>
  ) {}

  async findAllGeneral(): Promise<Sentencia[]> {
    return this.repository.find({
      order: {
        idSentencia: 'ASC',
      },
    })
  }

  async findOne(id: number): Promise<Sentencia | null> {
    return this.repository.findOne({
      where: {
        idSentencia: id,
      },
    })
  }
}