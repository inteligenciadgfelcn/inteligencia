import { UsuarioRol } from '../entity/usuario-rol.entity'
import { DataSource, EntityManager } from 'typeorm'
import { Rol } from '../entity/rol.entity'
import { Injectable } from '@nestjs/common'
import { Usuario } from '@/core/usuario/entity/usuario.entity'
import { UsuarioRolEstado } from '@/core/authorization/constant'

@Injectable()
export class UsuarioRolRepository {
  constructor(private dataSource: DataSource) {}

  async obtenerRolesPorUsuario(idUsuario: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(UsuarioRol) ??
      this.dataSource.getRepository(UsuarioRol)
    )
      .createQueryBuilder('usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('usuarioRol.id_usuario = :idUsuario', { idUsuario })
      .getMany()
  }

  async activar(
    idUsuario: string,
    roles: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const repo = transaction?.getRepository(UsuarioRol) ?? this.dataSource.getRepository(UsuarioRol)
    const entities = await repo.createQueryBuilder('ur')
      .where('ur.id_usuario = :idUsuario', { idUsuario })
      .andWhere('ur.id_rol IN (:...ids)', { ids: roles })
      .getMany()
    entities.forEach((e) => { e.estado = UsuarioRolEstado.ACTIVE; e.usuarioModificacion = usuarioAuditoria })
    return await repo.save(entities)
  }

  async inactivar(
    idUsuario: string,
    roles: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const repo = transaction?.getRepository(UsuarioRol) ?? this.dataSource.getRepository(UsuarioRol)
    const entities = await repo.createQueryBuilder('ur')
      .where('ur.id_usuario = :idUsuario', { idUsuario })
      .andWhere('ur.id_rol IN (:...ids)', { ids: roles })
      .getMany()
    entities.forEach((e) => { e.estado = UsuarioRolEstado.INACTIVE; e.usuarioModificacion = usuarioAuditoria })
    return await repo.save(entities)
  }

  async cambiarEstadoPorRoles(
    roles: Array<string>,
    estado: string,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const repo = transaction?.getRepository(UsuarioRol) ?? this.dataSource.getRepository(UsuarioRol)
    const entities = await repo.createQueryBuilder('ur')
      .andWhere('ur.id_rol IN (:...ids)', { ids: roles })
      .getMany()
    entities.forEach((e) => { e.estado = estado; e.usuarioModificacion = usuarioAuditoria })
    return await repo.save(entities)
  }

  async crear(
    idUsuario: string,
    roles: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const usuarioRoles = roles.map((idRol) => {
      const usuario = new Usuario()
      usuario.id = idUsuario

      const rol = new Rol()
      rol.id = idRol

      const usuarioRol = new UsuarioRol()
      usuarioRol.usuario = usuario
      usuarioRol.rol = rol
      usuarioRol.usuarioCreacion = usuarioAuditoria

      return usuarioRol
    })

    return await (
      transaction?.getRepository(UsuarioRol) ??
      this.dataSource.getRepository(UsuarioRol)
    ).save(usuarioRoles)
  }
}
