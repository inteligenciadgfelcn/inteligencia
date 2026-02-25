import { Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { UsuarioRepository } from '../repository/usuario.repository'

/**
 * Servicio para obtener datos de perfil del usuario
 * Usado para enriquecer el JWT con datos de la BD
 */
@Injectable()
export class UsuarioPerfilService extends BaseService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {
    super()
  }

  /**
   * Obtiene el perfil completo del usuario para el JWT
   */
  async obtenerPerfilParaJwt(usuarioLogin: string) {
    const usuario =
      await this.usuarioRepository.buscarPorUsuarioLogin(usuarioLogin)

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con login ${usuarioLogin} no encontrado`,
      )
    }

    return {
      id: usuario.idUsuario,
      usuarioLogin: usuario.usuarioLogin,
      nombreUsuario: usuario.nombreUsuario,
      nombreApp: usuario.nombreApp,
      email: usuario.email,
      telefonoCelular: usuario.telefonoCelular,
      esHabilitado: usuario.esHabilitado,
      grado: usuario.grado
        ? {
            id: usuario.grado.idGrado,
            abreviatura: usuario.grado.abreviatura,
            descripcion: usuario.grado.descripcion,
          }
        : null,
      grupo: usuario.grupo
        ? {
            id: usuario.grupo.idGrupo,
            descripcion: usuario.grupo.descripcion,
          }
        : null,
    }
  }

  /**
   * Valida si el usuario está habilitado
   */
  async validarUsuarioHabilitado(usuarioLogin: string): Promise<boolean> {
    const usuario =
      await this.usuarioRepository.buscarPorUsuarioLogin(usuarioLogin)
    return usuario?.esHabilitado ?? false
  }
}
