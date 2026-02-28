import { Controller, Get, Param, Req } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { UsuarioService } from '../service/usuario.service'
import { UsuarioPerfilService } from '../service/usuario-perfil.service'

// TODO: Reactivar guards para producción

@ApiTags('Usuarios (S2I)')
@Controller('usuarios')
export class UsuarioController extends BaseController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly perfilService: UsuarioPerfilService
  ) {
    super()
  }

  @ApiOperation({ summary: 'Listar usuarios habilitados' })
  @Get()
  async listar() {
    const datos = await this.usuarioService.listar()
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const dato = await this.usuarioService.buscarPorId(id)
    return this.successList(dato)
  }

  @ApiOperation({ summary: 'Obtener usuario por login' })
  @Get('login/:usuarioLogin')
  async buscarPorUsuarioLogin(@Param('usuarioLogin') usuarioLogin: string) {
    const dato = await this.usuarioService.buscarPorUsuarioLogin(usuarioLogin)
    return this.successList(dato)
  }

  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  @Get('perfil/me')
  async obtenerMiPerfil(@Req() req: any) {
    const usuarioLogin = req.user?.usuario || req.user?.sub
    const perfil = await this.perfilService.obtenerPerfilParaJwt(usuarioLogin)
    return this.successList(perfil)
  }
}
