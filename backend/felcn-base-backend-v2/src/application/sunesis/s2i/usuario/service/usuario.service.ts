import { Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { Usuario } from '../entity/usuario.entity'
import { UsuarioRepository } from '../repository/usuario.repository'

@Injectable()
export class UsuarioService extends BaseService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {
    super()
  }

  async buscarPorId(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(id)
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`)
    }
    return usuario
  }

  async buscarPorUsuarioLogin(usuarioLogin: string): Promise<Usuario> {
    const usuario =
      await this.usuarioRepository.buscarPorUsuarioLogin(usuarioLogin)
    if (!usuario) {
      throw new NotFoundException(
        `Usuario con login ${usuarioLogin} no encontrado`
      )
    }
    return usuario
  }

  async listar(): Promise<Usuario[]> {
    return this.usuarioRepository.listar()
  }

  async actualizarUltimoLogin(id: string): Promise<Usuario> {
    const usuario = await this.buscarPorId(id)
    usuario.fechaUltimoLogin = new Date()
    return this.usuarioRepository.actualizar(usuario)
  }
}
