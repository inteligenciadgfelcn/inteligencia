import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { ContenidoBienLgi} from '../entities/contenido-bien.entity'

@Injectable()
export class ContenidoBienLgiRepository {
  constructor(
    @InjectRepository(ContenidoBienLgi, DB_LGI)
    private readonly repository: Repository<ContenidoBienLgi>,
  ) {}

  create(data: Partial<ContenidoBienLgi>) {
    return this.repository.create(data)
  }

  save(data: ContenidoBienLgi) {
    return this.repository.save(data)
  }

  async findAllOrdered() {
    return await this.repository.find({
      order: {
        contbienId: 'ASC',
      },
    })
  }

  async findActiveById(id: number) {
    return await this.repository.findOne({
      where: {
        contbienId: id,
      },
    })
  }
}