import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'
import { MedidaCautelar } from '../entity/medida_cautelar.entity'

@Injectable()
export class MedidaCautelarRepository {
  constructor(
    @InjectRepository(MedidaCautelar, DB_LGI)
    private readonly repository: Repository<MedidaCautelar>
  ) {}

  async findAllGeneral(): Promise<MedidaCautelar[]> {
    return this.repository.find({
      order: {
        idMedidaCautelar: 'ASC',
      },
    })
  }

  async findOne(id: number): Promise<MedidaCautelar> {
    const medida = await this.repository.findOne({
      where: {
        idMedidaCautelar: id,
      },
    })

    if (!medida) {
      throw new NotFoundException(`No existe una medida cautelar con ID ${id}`)
    }

    return medida
  }
}
