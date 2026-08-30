import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Estado } from '@/application/inteligencia/felcn_siii/estado.enum'
import { DatosFamiliares } from '../entities/datos_familiare.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { InjectDataSource } from '@nestjs/typeorm'

@Injectable()
export class DatosFamiliaresRepository extends Repository<DatosFamiliares> {
  constructor(
    @InjectDataSource(DB_SII)
    dataSource: DataSource
  ) {
    super(DatosFamiliares, dataSource.createEntityManager())
  }

  async findAllPaginated(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro } = pagination

    const query = this.createQueryBuilder('df')
      .leftJoin('df.detenido', 'detenido')
      .leftJoinAndSelect('df.parentezco', 'parentezco')
      .where('df.estado = :estado', { estado: Estado.ACTIVO })
      .addSelect([
        'detenido.id_detenido',
        'detenido.nombres',
        'detenido.apellido_paterno',
        'detenido.apellido_materno',
      ])
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        `(df.nombres ILIKE :filtro OR df.paterno ILIKE :filtro OR df.materno ILIKE :filtro)`,
        { filtro: `%${filtro}%` }
      )
    }

    return await query.getManyAndCount()
  }

  async findActiveById(id: number) {
    return await this.findOne({
      where: {
        idDatosFamiliares: id,
      },
      relations: ['parentezco'],
    })
  }

  async findAllGeneral() {
    return await this.find({
      relations: ['parentezco'],
      order: { nombres: 'ASC' },
    })
  }

  async findByDetenido(idDetenido: number) {
    return await this.find({
      where: {
        detenido: { idDetenido },
      },
      relations: ['parentezco'],
      order: { nombres: 'ASC' },
    })
  }
}
