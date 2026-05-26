import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'
import { S2iAsignacion } from '../entity/asignacion.entity'

@Injectable()
export class CasoRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  private get repo() {
    return this.dataSource.getRepository(S2iAsignacion)
  }

  async crear(caso: S2iAsignacion): Promise<S2iAsignacion> {
    return this.repo.save(caso)
  }

  async buscarPorId(idCaso: string): Promise<S2iAsignacion | null> {
    return this.repo.findOne({
      where: { idCaso },
      relations: ['pais', 'estadoCaso', 'etapaInvestigacion'],
    })
  }

  async listarPorUsuario(
    usuario: string,
    idEtapa?: number
  ): Promise<S2iAsignacion[]> {
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.pais', 'pais')
      .leftJoinAndSelect('a.estadoCaso', 'estadoCaso')
      .leftJoinAndSelect('a.etapaInvestigacion', 'etapaInvestigacion')
      .where('a.usuario = :usuario', { usuario })

    if (idEtapa) qb.andWhere('a.idEtapaInvestigacion = :idEtapa', { idEtapa })

    return qb.orderBy('a.fechaInicio', 'DESC').getMany()
  }

  /**
   * Cuenta los casos del año en curso para un país dado.
   * Se usa para calcular el correlativo del número de caso: ALA-{idPais}-{N}/{GG}
   */
  async contarCasosPorPaisYGestion(
    idPais: number,
    gestion: number
  ): Promise<number> {
    const result = await this.dataSource
      .getRepository(S2iAsignacion)
      .createQueryBuilder('a')
      .where('a.idPais = :idPais', { idPais })
      .andWhere('EXTRACT(YEAR FROM a.fechaInicio) = :gestion', { gestion })
      .getCount()
    return result
  }
}
