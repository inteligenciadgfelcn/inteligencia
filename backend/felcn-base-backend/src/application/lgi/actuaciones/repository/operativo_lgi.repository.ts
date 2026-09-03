import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { Brackets, DataSource, Repository } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

import { OperativoLgi } from '../entities/operativoLgi.entity'
import { formatearFechaBolivia } from '@/common/utils/date.util'

@Injectable()
export class OperativoLgiRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource
  ) {}

  private get repository(): Repository<OperativoLgi> {
    return this.dataSource.getRepository(OperativoLgi)
  }

  async create(data: Partial<OperativoLgi>): Promise<OperativoLgi> {
    const operativo = this.repository.create(data)

    return this.repository.save(operativo)
  }

  async findOne(id: number): Promise<any | null> {
    const operativo = await this.repository
      .createQueryBuilder('o')
      .where('o.op_id = :id', { id })
      .andWhere('o.estado = :estado', { estado: 'ACTIVO' })
      .getOne()

    if (!operativo) {
      return null
    }

    return this.formatearRespuesta(operativo)
  }

  async findAllPaginadoByCaso(
    casosId: number,
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.repository
      .createQueryBuilder('o')
      .where('o.casos_id = :casosId', { casosId })
      .andWhere('o.estado = :estado', { estado: 'ACTIVO' })

    if (filtro?.trim()) {
      const valor = `%${filtro.trim()}%`

      query.andWhere(
        new Brackets((qb) => {
          qb.where('o.op_nrooper ILIKE :filtro', { filtro: valor })
            .orWhere('o.op_lugar ILIKE :filtro', { filtro: valor })
            .orWhere('o.op_descripcion ILIKE :filtro', { filtro: valor })
            .orWhere('o.otro_informe ILIKE :filtro', { filtro: valor })
        })
      )
    }

    const [operativos, total] = await query
      .orderBy('o.op_id', 'DESC')
      .take(limite)
      .skip(saltar)
      .getManyAndCount()

    const data = operativos.map((operativo) =>
      this.formatearRespuesta(operativo)
    )

    return [data, total]
  }

  async update(
    id: number,
    data: Partial<OperativoLgi>
  ): Promise<OperativoLgi | null> {
    const result = await this.repository
      .createQueryBuilder()
      .update(OperativoLgi)
      .set(data)
      .where('op_id = :id', { id })
      .returning('*')
      .execute()

    return result.raw[0] ?? null
  }

  async inactivar(id: number, usuario: string): Promise<OperativoLgi | null> {
    const operativo = await this.repository.findOne({
      where: {
        opId: id,
        estado: 'ACTIVO',
      },
    })

    if (!operativo) {
      return null
    }

    operativo.estado = 'INACTIVO'
    operativo.usuarioActualizacion = usuario

    return this.repository.save(operativo)
  }

  private formatearRespuesta(operativo: OperativoLgi) {
    return {
      ...operativo,

      opFechainf: formatearFechaBolivia(operativo.opFechainf),

      fechaRecepcionFiscalia: formatearFechaBolivia(
        operativo.fechaRecepcionFiscalia
      ),

      fechaHoraIng: formatearFechaBolivia(operativo.fechaHoraIng),

      fechaActualizacion: formatearFechaBolivia(operativo.fechaActualizacion),
    }
  }
}
