import { BaseException, LoggerService } from '@/core/logger'
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { BitacoraLoginRepository } from '../repository/bitacora-login.repository'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
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
    const {
      originalUrl,
      query,
      route,
      method: action,
    } = request
    const resource = Object.keys(query).length ? route.path : originalUrl
    const ip = this.extractIp(request)
    const userAgent = (request.headers['user-agent'] as string) || undefined
    const usuarioIntentado: string = request.body?.usuario ?? ''

    try {
      const isPermitted = (await super.canActivate(context)) as boolean
      if (!isPermitted) throw new UnauthorizedException()
    } catch (err) {
      await this.bitacoraLoginRepository
        .registrar({
          usuario: usuarioIntentado,
          ipOrigen: ip,
          userAgent,
          metodoAutenticacion: 'LOCAL',
          exitoso: false,
          motivoFallo: err?.message?.substring(0, 100) ?? 'Error de credenciales',
        })
        .catch(() => undefined)

      throw new BaseException(err, {
        accion: 'Verifique que las credenciales de acceso sean las correctas',
        metadata: {
          msg: `${action} ${resource} -> false - LOGIN BÁSICO (Error con usuario y contraseña)`,
        },
      })
    }

    const { user } = context.switchToHttp().getRequest()

    await this.bitacoraLoginRepository
      .registrar({
        idUsuario: user.id,
        usuario: usuarioIntentado,
        ipOrigen: ip,
        userAgent,
        metodoAutenticacion: 'LOCAL',
        exitoso: true,
      })
      .catch(() => undefined)

    this.logger.audit('authentication', {
      mensaje: 'Ingresó al sistema',
      metadata: {
        tipo: 'LOGIN BÁSICO',
        usuario: user.id,
      },
    })

    return true
  }
}
