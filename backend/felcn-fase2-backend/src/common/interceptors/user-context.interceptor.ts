import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { asyncLocalStorage, RequestContext } from '../context/request-context';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/usuario/user/entities/user.entity';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  constructor(
    private dataSource: DataSource,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const usuarioToken = request.user;

    const store = new Map<string, any>();

    return new Observable((subscriber) => {
      asyncLocalStorage.run(store, async () => {

        if (usuarioToken?.id) {
          const repo = this.dataSource.getRepository(User);

          const usuarioBD = await repo.findOne({
            where: { idUsuario: usuarioToken.id },
          });

          if (usuarioBD) {
            RequestContext.set('idUsuario', usuarioBD.idUsuario);
            RequestContext.set('nroPase', usuarioBD.nroPase);
          }
        }

        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}