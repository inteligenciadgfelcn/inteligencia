import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Request } from 'express';
import { SelectQueryBuilder } from 'typeorm';
import { PaginationResult } from '../interfaces/pagination-result.interface';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest<Request>();

    const page = parseInt(request.query.page as string) || 1;
    const pageSize = parseInt(request.query.pageSize as string) || 10;

    const skip = (page - 1) * pageSize;

    return next.handle().pipe(
      switchMap((result) => {

        if (result instanceof SelectQueryBuilder) {

          return from(
            result
              .take(pageSize)
              .skip(skip)
              .getManyAndCount(),
          ).pipe(
            map(([data, total]): PaginationResult<any> => ({
              data,
              total,
              page,
              pageSize,
              totalPages: Math.ceil(total / pageSize),
            })),
          );
        }

        return from(Promise.resolve(result));
      }),
    );
  }
}