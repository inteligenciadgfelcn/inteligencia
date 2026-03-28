import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditoriaAcceso } from 'src/modules/auditoria/auditoria.acceso.entity';
import { DataSource } from 'typeorm';
import { RequestContext } from '../context/request-context';

@Injectable()
export class AuditoriaAccesoInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    const metodo = request.method;
    const ruta = request.originalUrl;
    const ip = this.getClientIp(request);
    const parametros = request.query;

    return next.handle().pipe(
      tap(async (response) => {
        if (metodo !== 'GET') return;

        const repo = this.dataSource.getRepository(AuditoriaAcceso);

        await repo.save({
          ruta,
          metodo,
          id_usuario: RequestContext.get('idUsuario'),
          nro_pase: RequestContext.get('nroPase'),
          ip,
          parametros,
        });
      }),
    );
  }

  private getClientIp(request: any): string {
  const forwarded = request.headers['x-forwarded-for'];
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return (
    request.headers['x-real-ip'] ||
    request.socket?.remoteAddress ||
    request.ip
  );
}
}