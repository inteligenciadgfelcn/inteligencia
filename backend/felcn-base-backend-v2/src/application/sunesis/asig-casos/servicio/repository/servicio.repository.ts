import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Servicio } from '../entity/servicio.entity'
import { FiltrosServicioDto } from '../dto'
import { DB_ASIG_CASOS } from '../../../shared/constants'

@Injectable()
export class ServicioRepository {
  constructor(
    @InjectDataSource(DB_ASIG_CASOS)
    private dataSource: DataSource,
  ) {}

  private get repository() {
    return this.dataSource.getRepository(Servicio)
  }

  async crear(servicio: Servicio): Promise<Servicio> {
    return this.repository.save(servicio)
  }

  async listar(filtros: FiltrosServicioDto): Promise<[Servicio[], number]> {
    const query = this.repository.createQueryBuilder('servicio')

    if (filtros.usuarioLogin) {
      query.andWhere('servicio.usuarioLogin = :usuarioLogin', {
        usuarioLogin: filtros.usuarioLogin,
      })
    }

    if (filtros.usuarioEjecutor) {
      query.andWhere('servicio.usuarioEjecutor = :usuarioEjecutor', {
        usuarioEjecutor: filtros.usuarioEjecutor,
      })
    }

    query.orderBy('servicio.fechaHoraIngreso', 'DESC')

    if (filtros.limite && filtros.pagina) {
      query.skip((filtros.pagina - 1) * filtros.limite)
      query.take(filtros.limite)
    }

    return query.getManyAndCount()
  }

  async buscarPorCodigo(codigoServicio: string): Promise<Servicio | null> {
    return this.repository.findOne({ where: { codigoServicio } })
  }

  async buscarActivoPorUsuario(usuarioLogin: string): Promise<Servicio | null> {
    const ahora = new Date()
    return this.repository
      .createQueryBuilder('servicio')
      .where('servicio.usuarioLogin = :usuarioLogin', { usuarioLogin })
      .andWhere('servicio.fechaHoraIngreso <= :ahora', { ahora })
      .andWhere('servicio.fechaHoraSalida >= :ahora', { ahora })
      .getOne()
  }

  async eliminar(codigoServicio: string): Promise<void> {
    await this.repository.delete({ codigoServicio })
  }
}
