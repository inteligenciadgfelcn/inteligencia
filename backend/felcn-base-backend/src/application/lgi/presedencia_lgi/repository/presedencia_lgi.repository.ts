import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DB_LGI } from '@/core/config/database/database.module'

import { PresedenciaLgi } from '../entities/presedencia_lgi.entity'

@Injectable()
export class PresedenciaLgiRepository {
  constructor(
    @InjectRepository(PresedenciaLgi, DB_LGI)
    private readonly repository: Repository<PresedenciaLgi>
  ) {}

  buscarActivoPorCasoYNumero(
    casosId: string,
    numeroCaso: string
  ): Promise<PresedenciaLgi | null> {
    return this.repository
      .createQueryBuilder('p')
      .where('p.casosId = :casosId', { casosId })
      .andWhere('p.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('UPPER(TRIM(p.nrocasopre)) = :numeroCaso', {
        numeroCaso,
      })
      .getOne()
  }

  buscarActivoPorId(id: number): Promise<PresedenciaLgi | null> {
    return this.repository.findOne({
      where: {
        preseId: String(id),
        estado: 'ACTIVO',
      },
    })
  }

  guardar(presedencia: PresedenciaLgi): Promise<PresedenciaLgi> {
    return this.repository.save(presedencia)
  }

  crear(datos: Partial<PresedenciaLgi>): PresedenciaLgi {
    return this.repository.create(datos)
  }

  findAllPaginadoByCaso(
    casosId: number,
    pagination: PaginacionQueryDto
  ): Promise<[PresedenciaLgi[], number]> {
    const pagina = Math.max(Number(pagination.pagina) || 1, 1)
    const limite = Math.min(
      Math.max(Number(pagination.limite) || 10, 1),
      100
    )

    return this.repository.findAndCount({
      where: {
        casosId: String(casosId),
        estado: 'ACTIVO',
      },
      order: {
        preseId: 'DESC',
      },
      skip: (pagina - 1) * limite,
      take: limite,
    })
  }
}