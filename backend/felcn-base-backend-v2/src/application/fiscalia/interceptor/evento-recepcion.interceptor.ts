import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { Request, Response } from 'express'
import { MpEventoRecepcionRepository } from '../repository/mp-evento-recepcion.repository'

/**
 * Interceptor EventoRecepcionInterceptor
 * Registra en fiscalia.mp_evento_recepcion cada petición recibida del MP
 * (endpoint, payload, respuesta, IP de origen y duración). El registro es
 * fire-and-forget: un fallo de bitácora nunca afecta la respuesta al MP.
 */
@Injectable()
export class EventoRecepcionInterceptor implements NestInterceptor {
  constructor(private readonly eventoRepository: MpEventoRecepcionRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const inicio = Date.now()
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      tap((body) => {
        this.eventoRepository
          .registrar({
            endpoint: request.originalUrl,
            metodo: request.method,
            payload: (request.body as Record<string, unknown>) ?? null,
            respuesta: (body as Record<string, unknown>) ?? null,
            httpStatus: response.statusCode,
            ipOrigen: request.ip ?? null,
            duracionMs: Date.now() - inicio,
          })
          .catch(() => undefined)
      })
    )
  }
}
