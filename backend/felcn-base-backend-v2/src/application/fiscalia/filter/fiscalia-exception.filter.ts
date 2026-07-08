import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { BaseException, LoggerService } from '@/core/logger'
import {
  PROBLEM_JSON_CONTENT_TYPE,
  ProblemDetails,
} from '../interface/problem-details.interface'

const TITULOS: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Errores de validación',
  [HttpStatus.NOT_FOUND]: 'Recurso no encontrado',
  [HttpStatus.CONFLICT]: 'Conflicto con el estado actual del recurso',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Error interno',
}

/**
 * Filtro FiscaliaExceptionFilter
 * Convierte cualquier excepción de los endpoints external/fiscalia al
 * formato RFC 9457 Problem Details (application/problem+json).
 * Tiene precedencia sobre el filtro global de la aplicación al declararse
 * con @UseFilters en los controllers del módulo.
 */
@Catch()
export class FiscaliaExceptionFilter implements ExceptionFilter {
  private logger = LoggerService.getInstance()

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()
    const problem = this.construirProblema(exception)

    if (problem.status >= 500) {
      this.logger.error(exception, 'Error no controlado en módulo fiscalía')
    }

    response
      .status(problem.status)
      .type(PROBLEM_JSON_CONTENT_TYPE)
      .json(problem)
  }

  private construirProblema(exception: unknown): ProblemDetails {
    if (exception instanceof BaseException) {
      const status = exception.httpStatus
      const clientInfo = exception.clientInfo as
        | { erroresValidacion?: Record<string, string[]> }
        | undefined
      return {
        type: 'about:blank',
        title: TITULOS[status] ?? exception.mensaje,
        status,
        detail: exception.mensaje,
        ...(clientInfo?.erroresValidacion && {
          errores: clientInfo.erroresValidacion,
        }),
      }
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const respuesta = exception.getResponse()
      const detail =
        typeof respuesta === 'string'
          ? respuesta
          : ((respuesta as { message?: string | string[] }).message ??
            exception.message)
      return {
        type: 'about:blank',
        title: TITULOS[status] ?? exception.message,
        status,
        detail: Array.isArray(detail) ? detail.join('; ') : detail,
      }
    }

    return {
      type: 'about:blank',
      title: TITULOS[HttpStatus.INTERNAL_SERVER_ERROR],
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      detail: 'Ocurrió un error inesperado al procesar la solicitud',
    }
  }
}
