import { DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Grupo } from '../entity/grupo.entity'
import { GrupoEstado } from '../constant'
import { CrearGrupoDto, ActualizarGrupoDto } from '../dto/grupo.dto'

@Injectable()
export class GrupoRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: number) {
    return await this.dataSource
      .getRepository(Grupo)
      .findOne({ where: { id }, relations: ['distrital', 'distrital.unidad'] })
  }

  async listar(idDistrital?: number) {
    const query = this.dataSource
      .getRepository(Grupo)
      .createQueryBuilder('grupo')
      .leftJoin('grupo.distrital', 'distrital')
      .leftJoin('distrital.unidad', 'unidad')
      .select([
        'grupo.id',
        'grupo.descripcion',
        'grupo.idDistrital',
        'grupo.estado',
        'distrital.id',
        'distrital.descripcion',
        'unidad.id',
        'unidad.abreviatura',
      ])
      .where('grupo._estado = :estado', { estado: GrupoEstado.ACTIVE })
      .orderBy('grupo.descripcion', 'ASC')

    if (idDistrital) {
      query.andWhere('grupo.id_distrital = :idDistrital', { idDistrital })
    }

    return await query.getMany()
  }

  async listarTodos() {
    return await this.dataSource
      .getRepository(Grupo)
      .createQueryBuilder('grupo')
      .leftJoin('grupo.distrital', 'distrital')
      .leftJoin('distrital.unidad', 'unidad')
      .select([
        'grupo.id',
        'grupo.descripcion',
        'grupo.idDistrital',
        'grupo.estado',
        'distrital.id',
        'distrital.descripcion',
        'unidad.id',
        'unidad.abreviatura',
      ])
      .orderBy('grupo.descripcion', 'ASC')
      .getManyAndCount()
  }

  async crear(dto: CrearGrupoDto, usuarioAuditoria: string) {
    const grupo = new Grupo()
    grupo.idDistrital = dto.idDistrital
    grupo.descripcion = dto.descripcion
    grupo.usuarioCreacion = usuarioAuditoria
    return await this.dataSource.getRepository(Grupo).save(grupo)
  }

  async actualizar(id: number, dto: ActualizarGrupoDto, usuarioAuditoria: string) {
    const repo = this.dataSource.getRepository(Grupo)
    const existing = await repo.findOne({ where: { id } })
    if (!existing) return null
    Object.assign(existing, { ...dto, usuarioModificacion: usuarioAuditoria })
    return await repo.save(existing)
  }
}
