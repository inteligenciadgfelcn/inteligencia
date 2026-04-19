import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ItemOperativo } from './entities/item_operativo.entity'
import { DB_SOSPECHOSO } from '@/core/config/database/database.module'

@Injectable()
export class ItemOperativoService {
  constructor(
    @InjectRepository(ItemOperativo, DB_SOSPECHOSO)
    private readonly repo: Repository<ItemOperativo>
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['categoria'],
      order: {
        idItemOperativo: 'ASC',
      },
    })
  }

  findByCategoria(idCategoria: number) {
    return this.repo.find({
      where: { idCategoriaOperativo: idCategoria },
      order: { idItemOperativo: 'ASC' },
    })
  }
}
