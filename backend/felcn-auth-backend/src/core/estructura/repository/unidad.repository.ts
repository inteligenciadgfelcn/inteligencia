import { DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Unidad } from '../entity/unidad.entity'
import { UnidadEstado } from '../constant'
import { CrearUnidadDto, ActualizarUnidadDto } from '../dto/unidad.dto'

@Injectable()
export class UnidadRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: number) {
    return await this.dataSource.getRepository(Unidad).findOne({ where: { id } })
  }

  async listar() {
    return await this.dataSource
      .getRepository(Unidad)
      .createQueryBuilder('unidad')
      .select(['unidad.id', 'unidad.abreviatura', 'unidad.descripcion', 'unidad.esOperativaAdmin', 'unidad.estado'])
      .where('unidad._estado = :estado', { estado: UnidadEstado.ACTIVE })
      .orderBy('unidad.descripcion', 'ASC')
      .getMany()
  }

  async listarTodos() {
    return await this.dataSource
      .getRepository(Unidad)
      .createQueryBuilder('unidad')
      .select(['unidad.id', 'unidad.abreviatura', 'unidad.descripcion', 'unidad.esOperativaAdmin', 'unidad.estado'])
      .orderBy('unidad.descripcion', 'ASC')
      .getManyAndCount()
  }

  async crear(dto: CrearUnidadDto, usuarioAuditoria: string) {
    const unidad = new Unidad()
    unidad.abreviatura = dto.abreviatura
    unidad.descripcion = dto.descripcion
    unidad.esOperativaAdmin = dto.esOperativaAdmin
    unidad.usuarioCreacion = usuarioAuditoria
    return await this.dataSource.getRepository(Unidad).save(unidad)
  }

  async actualizar(id: number, dto: ActualizarUnidadDto, usuarioAuditoria: string) {
    const datos = new Unidad({ ...dto, usuarioModificacion: usuarioAuditoria })
    return await this.dataSource.getRepository(Unidad).update(id, datos)
  }
}
