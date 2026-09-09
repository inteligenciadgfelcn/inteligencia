import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { TipoVinculoLgi } from '../entities/tipo-vinculo.entity'
import { BieneSecuestradoLgi } from '@/application/lgi/bienes_secuestrados/entities/bienes_secuestrado.entity'

@Injectable()
export class TipoVinculoLgiRepository {
  constructor(
    @InjectRepository(TipoVinculoLgi, DB_LGI)
    private readonly repository: Repository<TipoVinculoLgi>
  ) {}

  create(data: Partial<TipoVinculoLgi>) {
    return this.repository.create(data)
  }

  save(data: TipoVinculoLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        idVinculo: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        idVinculo: id,
      },
    })
  }

  async findAllByVinculo(id: number) {
    return await this.repository.find({
      where: {
        idVinculo: id,
      },
    })
  }

  findAllByTipoVinculo(idVinculo: number): Promise<TipoVinculoLgi[]> {
    return this.repository.find({
      where: {
        idVinculo: idVinculo,
      },
    })
  }
}
