import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { VinculoLgi } from '../entities/vinculo.entity'

@Injectable()
export class VinculoLgiRepository {
  constructor(
    @InjectRepository(VinculoLgi, DB_LGI)
    private readonly repository: Repository<VinculoLgi>,
  ) {}

  create(data: Partial<VinculoLgi>) {
    return this.repository.create(data)
  }

  save(unidad: VinculoLgi) {
    return this.repository.save(unidad)
  }

  async findAllOrdered() {
    return await this.repository.find({
      where: {empresa:false},
      order: {
        idVinculo: 'ASC',
      },
    })
  }

   async findAllPersonaJuridica() {
    return await this.repository.find({
      where: {empresa:true},
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
}