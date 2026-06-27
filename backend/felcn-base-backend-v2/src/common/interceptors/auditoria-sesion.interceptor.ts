import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { Observable } from 'rxjs'
import { DataSource } from 'typeorm'
import { randomUUID } from 'crypto'
import { DB_AUTH, DB_S2I, DB_SIII } from '@/core/config/database/database.module'
import { auditoriaContexto } from '@/common/context/auditoria-contexto'

@Injectable()
export class AuditoriaSesionInterceptor implements NestInterceptor {
  constructor(
    @InjectDataSource(DB_AUTH) private readonly dsAuth: DataSource,
    @InjectDataSource(DB_SIII) private readonly dsSiii: DataSource,
    @InjectDataSource(DB_S2I) private readonly dsS2i: DataSource,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> | Observable<any> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user?.id || !/^\d+$/.test(String(user.id))) return next.handle()

    const userId = String(user.id)
    const userName = String(user.usuario ?? user.username ?? user.id)
      .replace(/'/g, '')
      .substring(0, 50)
    const idOperacion = randomUUID()

    // Fijar variables de sesión PostgreSQL para los triggers de auditoría
    // (best-effort: no garantiza la misma conexión que las queries posteriores)
    const queries = [
      `SET app.usuario_id = '${userId}'`,
      `SET app.usuario_nombre = '${userName}'`,
      `SET app.id_operacion = '${idOperacion}'`,
    ]
    Promise.all(
      [this.dsAuth, this.dsSiii, this.dsS2i].flatMap((ds) =>
        queries.map((q) => ds.query(q).catch(() => undefined)),
      ),
    )

    // AsyncLocalStorage propaga el contexto a través de toda la cadena async,
    // incluyendo transacciones TypeORM con cualquier conexión del pool.
    return new Observable((observer) => {
      auditoriaContexto.run({ idOperacion, userId, userName }, () => {
        next.handle().subscribe({
          next: (v) => observer.next(v),
          error: (e) => observer.error(e),
          complete: () => observer.complete(),
        })
      })
    })
  }
}
