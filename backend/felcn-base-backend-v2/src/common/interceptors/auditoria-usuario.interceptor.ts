import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class AuditoriaUsuarioInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest()

    const usuario =
      request.user?.numeroPase || 'SISTEMA'

    if (request.method === 'POST') {
      request.body.usuario = usuario
    }

    if (
      request.method === 'PATCH' ||
      request.method === 'PUT'
    ) {
      request.body.usuarioActualizacion = usuario
    }

    return next.handle()
  }
}