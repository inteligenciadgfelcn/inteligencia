import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponseFormat<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
}

interface OriginalData {
  code: any;
  message: any;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((originalData: OriginalData) => {
        if (
          originalData?.code !== undefined &&
          originalData?.message !== undefined
        ) {
          return originalData;
        }

        const { data, meta } = normalizeData(originalData);

        return {
          success: true,
          message: 'Operation successful',
          ...(data !== undefined && { data }),
          ...(meta !== undefined && { meta }),
        };
      }),
    ) as Observable<ResponseFormat<T>>;
  }
}

function normalizeData(original: unknown): {
  data?: unknown;
  meta?: Record<string, unknown> | undefined;
} {
  if (typeof original !== 'object' || original === null) {
    return { data: original };
  }

  const knownMetaKeys = ['total', 'limit', 'offset', 'page', 'currentPage'];

  const meta: Record<string, unknown> = {};
  const clone = { ...(original as Record<string, unknown>) };

  let data = clone.data ?? null;

  if (!data) {
    data = original;
  } else {
    for (const key of knownMetaKeys) {
      if (key in clone) {
        meta[key] = clone[key];
        delete clone[key];
      }
    }
  }

  const hasMeta = Object.keys(meta).length > 0;
  return { data, meta: hasMeta ? meta : undefined };
}
