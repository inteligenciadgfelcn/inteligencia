import { DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Grado } from '../entity/grado.entity'
import { GradoEstado } from '../constant'
import { CrearGradoDto, ActualizarGradoDto } from '../dto/grado.dto'

@Injectable()
export class GradoRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: number) {
    return await this.dataSource.getRepository(Grado).findOne({ where: { id } })
  }

  async listar() {
    return await this.dataSource
      .getRepository(Grado)
      .createQueryBuilder('grado')
      .select(['grado.id', 'grado.abreviatura', 'grado.descripcion', 'grado.orden', 'grado.estado'])
      .where('grado._estado = :estado', { estado: GradoEstado.ACTIVE })
      .orderBy('grado.orden', 'ASC')
      .addOrderBy('grado.descripcion', 'ASC')
      .getMany()
  }

  async listarTodos() {
    return await this.dataSource
      .getRepository(Grado)
      .createQueryBuilder('grado')
      .select(['grado.id', 'grado.abreviatura', 'grado.descripcion', 'grado.orden', 'grado.estado'])
      .orderBy('grado.orden', 'ASC')
      .addOrderBy('grado.descripcion', 'ASC')
      .getManyAndCount()
  }

  async crear(dto: CrearGradoDto, usuarioAuditoria: string) {
    const grado = new Grado()
    grado.abreviatura = dto.abreviatura
    grado.descripcion = dto.descripcion
    grado.orden = dto.orden ?? null
    grado.usuarioCreacion = usuarioAuditoria
    return await this.dataSource.getRepository(Grado).save(grado)
  }

  async actualizar(id: number, dto: ActualizarGradoDto, usuarioAuditoria: string) {
    const repo = this.dataSource.getRepository(Grado)
    const existing = await repo.findOne({ where: { id } })
    if (!existing) return null
    Object.assign(existing, { ...dto, usuarioModificacion: usuarioAuditoria })
    return await repo.save(existing)
  }
}
