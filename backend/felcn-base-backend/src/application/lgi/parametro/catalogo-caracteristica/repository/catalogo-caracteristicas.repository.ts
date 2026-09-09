import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CatalogoCaracteristicasLgi} from '../entities/catalogo-caracteristica.entity'

@Injectable()
export class CatalogoCaracteristicaLgiRepository {
  constructor(
    @InjectRepository(CatalogoCaracteristicasLgi, DB_LGI)
    private readonly repository: Repository<CatalogoCaracteristicasLgi>,
  ) {}

  create(data: Partial<CatalogoCaracteristicasLgi>) {
    return this.repository.create(data)
  }

  save(data: CatalogoCaracteristicasLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        catcaracId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        catcaracId: id,
      },
    })
  }

  async findAllByCaracteristicaClase(id: number) {
    return await this.repository.find({
      where: {
        catclasId: id,
      },
    })
  }
}