import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Usuario } from '../entity/usuario.entity'
import { DB_S2I } from '../../../shared/constants'

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource,
  ) {}

  private get repository() {
    return this.dataSource.getRepository(Usuario)
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.repository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.grado', 'grado')
      .leftJoinAndSelect('usuario.grupo', 'grupo')
      .where('usuario.id = :id', { id })
      .getOne()
  }

  async buscarPorUsuarioLogin(usuarioLogin: string): Promise<Usuario | null> {
    return this.repository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.grado', 'grado')
      .leftJoinAndSelect('usuario.grupo', 'grupo')
      .where('usuario.usuarioLogin = :usuarioLogin', { usuarioLogin })
      .getOne()
  }

  async buscarPorNombreUsuario(nombreUsuario: string): Promise<Usuario | null> {
    return this.repository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.grado', 'grado')
      .leftJoinAndSelect('usuario.grupo', 'grupo')
      .where('usuario.nombreUsuario = :nombreUsuario', { nombreUsuario })
      .getOne()
  }

  async listar(): Promise<Usuario[]> {
    return this.repository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.grado', 'grado')
      .leftJoinAndSelect('usuario.grupo', 'grupo')
      .where('usuario.esHabilitado = true')
      .orderBy('usuario.nombreApp', 'ASC')
      .getMany()
  }

  async actualizar(usuario: Usuario): Promise<Usuario> {
    return this.repository.save(usuario)
  }
}
