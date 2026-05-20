import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { InternalService, CrearUsuarioInternoDto } from './internal.service'

/**
 * Endpoints internos — sólo para uso desde auth-backend en entorno de desarrollo.
 * No tiene autenticación; se asume que no es accesible desde el exterior.
 */
@Controller('internal')
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  /**
   * Crea un usuario en el fake de Ciudadanía Digital.
   * Idempotente: si ya existe el CI, devuelve { creado: false } sin error.
   */
  @Post('usuarios')
  @HttpCode(HttpStatus.OK)
  crearUsuario(@Body() dto: CrearUsuarioInternoDto) {
    return this.internalService.crearUsuario(dto)
  }
}
