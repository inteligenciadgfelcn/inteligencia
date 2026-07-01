import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CatalogoTipoLgi} from '../entities/catalogo-tipo.entity'

@Injectable()
export class CatalogoTipoLgiRepository {
  constructor(
    @InjectRepository(CatalogoTipoLgi, DB_LGI)
    private readonly repository: Repository<CatalogoTipoLgi>,
  ) {}

  create(data: Partial<CatalogoTipoLgi>) {
    return this.repository.create(data)
  }

  save(data: CatalogoTipoLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        cattipoId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        cattipoId: id,
      },
    })
  }
}