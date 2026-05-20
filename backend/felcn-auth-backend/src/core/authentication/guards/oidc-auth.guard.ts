import { BaseException, LoggerService } from '@/core/logger'
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class OidcAuthGuard extends AuthGuard('oidc') {
  protected logger = LoggerService.getInstance()

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    console.log('[OIDC-GUARD] query:', request.query)
    console.log('[OIDC-GUARD] session keys:', Object.keys(request.session || {}))
    console.log('[OIDC-GUARD] session id:', request.session?.id)

    try {
      const isPermitted = (await super.canActivate(context)) as boolean
      console.log('[OIDC-GUARD] isPermitted:', isPermitted)
      if (!isPermitted) throw new UnauthorizedException()
    } catch (err) {
      console.error('[OIDC-GUARD] ERROR:', err?.message || err)
      console.error('[OIDC-GUARD] ERROR stack:', err?.stack)
      throw new BaseException(err, {
        modulo: 'CIUDADANÍA:PROVEEDOR IDENTIDAD',
        mensaje: 'Error de autenticación con Ciudadanía',
        accion: `Asegúrese de que el cliente de ciudadanía se encuentre correctamente configurado`,
      })
    }

    await super.logIn(request)

    const { user } = context.switchToHttp().getRequest()

    this.logger.audit('authentication', {
      mensaje: 'Ingresó al sistema',
      metadata: {
        tipo: 'CIUDADANÍA',
        usuario: user.id,
      },
    })

    return true
  }
}
