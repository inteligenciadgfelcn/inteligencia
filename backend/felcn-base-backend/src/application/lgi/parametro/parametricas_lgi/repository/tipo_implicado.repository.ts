import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'
import { TipoImplicado } from '../entity/tipo-implicado.entity'

@Injectable()
export class TipoImplicadoRepository {
  constructor(
    @InjectRepository(TipoImplicado, DB_LGI)
    private readonly repository: Repository<TipoImplicado>,
  ) {}

  async findAllGeneral(): Promise<TipoImplicado[]> {
    return this.repository.find({
      order: { descripcion: 'ASC' },
    })
  }
}