import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { SolicitudRegistro } from '../entity/solicitud-registro.entity'
import { FiltrosSolicitudRegistroDto } from '../dto/filtros-solicitud-registro.dto'

@Injectable()
export class SolicitudRegistroRepository {
  constructor(private dataSource: DataSource) {}

  async crear(datos: Partial<SolicitudRegistro>): Promise<SolicitudRegistro> {
    return await this.dataSource
      .getRepository(SolicitudRegistro)
      .save(datos)
  }

  async listar(filtros: FiltrosSolicitudRegistroDto) {
    const { limite, saltar, estado, orden, sentido } = filtros

    const query = this.dataSource
      .getRepository(SolicitudRegistro)
      .createQueryBuilder('solicitud')
      .take(limite)
      .skip(saltar)

    if (estado) {
      query.andWhere('solicitud.estado = :estado', { estado })
    }

    query.orderBy(
      orden ? `solicitud.${orden}` : 'solicitud.fechaCreacion',
      sentido ?? 'DESC'
    )

    return await query.getManyAndCount()
  }

  async buscarPorId(id: string): Promise<SolicitudRegistro | null> {
    return await this.dataSource
      .getRepository(SolicitudRegistro)
      .findOne({ where: { id } })
  }

  async actualizar(
    id: string,
    datos: Partial<SolicitudRegistro>
  ): Promise<void> {
    await this.dataSource
      .getRepository(SolicitudRegistro)
      .update({ id }, datos)
  }
}
