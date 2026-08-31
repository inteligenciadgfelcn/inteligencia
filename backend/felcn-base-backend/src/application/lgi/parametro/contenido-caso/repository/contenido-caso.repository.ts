import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { ContenidoCasoLgi} from '../entities/contenido-caso.entity'

@Injectable()
export class ContenidoCasoLgiRepository {
  constructor(
    @InjectRepository(ContenidoCasoLgi, DB_LGI)
    private readonly repository: Repository<ContenidoCasoLgi>,
  ) {}

  create(data: Partial<ContenidoCasoLgi>) {
    return this.repository.create(data)
  }

  save(data: ContenidoCasoLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        contcasoId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        contcasoId: id,
      },
    })
  }
}