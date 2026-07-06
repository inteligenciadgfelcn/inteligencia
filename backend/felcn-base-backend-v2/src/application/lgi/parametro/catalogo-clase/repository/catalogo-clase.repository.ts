import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CatalogoClaseLgi } from '../entities/catalogo-clase.entity'

@Injectable()
export class CatalogoClaseLgiRepository {
  constructor(
    @InjectRepository(CatalogoClaseLgi, DB_LGI)
    private readonly repository: Repository<CatalogoClaseLgi>,
  ) {}

  create(data: Partial<CatalogoClaseLgi>) {
    return this.repository.create(data)
  }

  save(data: CatalogoClaseLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        catClasId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        catClasId: id,
      },
    })
  }
}