import { DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Distrital } from '../entity/distrital.entity'
import { DistritaEstado } from '../constant'
import { CrearDistritaDto, ActualizarDistritaDto } from '../dto/distrital.dto'

@Injectable()
export class DistritaRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: number) {
    return await this.dataSource
      .getRepository(Distrital)
      .findOne({ where: { id }, relations: ['unidad'] })
  }

  async listar(idUnidad?: number) {
    const query = this.dataSource
      .getRepository(Distrital)
      .createQueryBuilder('distrital')
      .leftJoinAndSelect('distrital.unidad', 'unidad')
      .select([
        'distrital.id',
        'distrital.descripcion',
        'distrital.idUnidad',
        'distrital.estado',
        'unidad.id',
        'unidad.abreviatura',
        'unidad.descripcion',
      ])
      .where('distrital._estado = :estado', { estado: DistritaEstado.ACTIVE })
      .orderBy('distrital.descripcion', 'ASC')

    if (idUnidad) {
      query.andWhere('distrital.id_unidad = :idUnidad', { idUnidad })
    }

    return await query.getMany()
  }

  async listarTodos() {
    return await this.dataSource
      .getRepository(Distrital)
      .createQueryBuilder('distrital')
      .leftJoin('distrital.unidad', 'unidad')
      .select([
        'distrital.id',
        'distrital.descripcion',
        'distrital.idUnidad',
        'distrital.estado',
        'unidad.id',
        'unidad.abreviatura',
      ])
      .orderBy('distrital.descripcion', 'ASC')
      .getManyAndCount()
  }

  async crear(dto: CrearDistritaDto, usuarioAuditoria: string) {
    const distrital = new Distrital()
    distrital.idUnidad = dto.idUnidad
    distrital.descripcion = dto.descripcion
    distrital.usuarioCreacion = usuarioAuditoria
    return await this.dataSource.getRepository(Distrital).save(distrital)
  }

  async actualizar(id: number, dto: ActualizarDistritaDto, usuarioAuditoria: string) {
    const datos = new Distrital({ ...dto, usuarioModificacion: usuarioAuditoria })
    return await this.dataSource.getRepository(Distrital).update(id, datos)
  }
}
