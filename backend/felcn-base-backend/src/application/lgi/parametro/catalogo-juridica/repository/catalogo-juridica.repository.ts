import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CatalogoJuridicaLgi} from '../entities/catalogo-juridica.entity'

@Injectable()
export class CatalogoJuridicaLgiRepository {
  constructor(
    @InjectRepository(CatalogoJuridicaLgi, DB_LGI)
    private readonly repository: Repository<CatalogoJuridicaLgi>,
  ) {}

  create(data: Partial<CatalogoJuridicaLgi>) {
    return this.repository.create(data)
  }

  save(data: CatalogoJuridicaLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        catjurId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        catjurId: id,
      },
    })
  }
}