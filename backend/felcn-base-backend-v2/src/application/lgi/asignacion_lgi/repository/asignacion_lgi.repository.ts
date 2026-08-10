import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { AsignacionLgi } from '../entities/asignacion_lgi.entity'

@Injectable()
export class AsignacionLgiRepository {
  constructor(
    @InjectRepository(AsignacionLgi, DB_LGI)
    private readonly repository: Repository<AsignacionLgi>
  ) {}

  async findAllPaginado(
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.repository
      .createQueryBuilder('a')
      .innerJoin('distritales', 'd', 'a.dis_id = d.dis_id')
      .innerJoin('etapainvest', 'e', 'a.eta_inv = e.eta_inv')

    if (filtro?.trim()) {
      const valor = `%${filtro.trim()}%`

      query.andWhere(
        new Brackets((qb) => {
          qb.where('a.nombrecaso ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocaso ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasogiaef ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasofis ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasoifp ILIKE :filtro', { filtro: valor })
            .orWhere('a.cudifp ILIKE :filtro', { filtro: valor })
        })
      )
    }

    const total = await query.clone().getCount()

    const data = await query
      .select([
        'a.*',
        'd.dis_descripcion AS "regional"',
        'e.descripcion AS "etapaInvestigacion"',
      ])
      .orderBy('a.casos_id', 'DESC')
      .take(limite)
      .skip(saltar)
      .getRawMany()

    return [data, total]
  }
}
