import { BaseException, LoggerService } from '@/core/logger'
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { BitacoraLoginRepository } from '../repository/bitacora-login.repository'

@Injectable()
export class OidcAuthGuard extends AuthGuard('oidc') {
  protected logger = LoggerService.getInstance()

  constructor(
    private readonly bitacoraLoginRepository: BitacoraLoginRepository
  ) {
    super()
  }

  private extractIp(request: any): string {
    return (
      (request.headers['x-forwarded-for'] as string)
        ?.split(',')[0]
        ?.trim() ||
      request.ip ||
      'desconocida'
    )
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const ip = this.extractIp(request)
    const userAgent = (request.headers['user-agent'] as string) || undefined

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

      await this.bitacoraLoginRepository
        .registrar({
          usuario: 'CIUDADANÍA',
          ipOrigen: ip,
          userAgent,
          metodoAutenticacion: 'CIUDADANIA',
          exitoso: false,
          motivoFallo: err?.message?.substring(0, 100) ?? 'Error OIDC',
        })
        .catch(() => undefined)

      throw new BaseException(err, {
        modulo: 'CIUDADANÍA:PROVEEDOR IDENTIDAD',
        mensaje: 'Error de autenticación con Ciudadanía',
        accion: `Asegúrese de que el cliente de ciudadanía se encuentre correctamente configurado`,
      })
    }

    await super.logIn(request)

    const { user } = context.switchToHttp().getRequest()

    await this.bitacoraLoginRepository
      .registrar({
        idUsuario: user.id,
        usuario: 'CIUDADANÍA',
        ipOrigen: ip,
        userAgent,
        metodoAutenticacion: 'CIUDADANIA',
        exitoso: true,
        sessionId: request.sessionID ?? null,
      })
      .catch(() => undefined)

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
