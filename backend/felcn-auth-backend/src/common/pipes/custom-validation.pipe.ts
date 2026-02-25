import { ValidationPipe, ValidationError, HttpStatus } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { BaseException, ERROR_CODE } from '@/core/logger'
import { HttpMessages } from '@/core/logger/messages'

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const { erroresValidacion, erroresTextoPlano } =
          armarErroresValidacion(validationErrors)
        return new BaseException(undefined, {
          codigo: ERROR_CODE.DTO_VALIDATION_ERROR,
          httpStatus: HttpStatus.BAD_REQUEST,
          causa: erroresTextoPlano,
          mensaje: HttpMessages.EXCEPTION_BAD_REQUEST,
          accion: 'Verificar las propiedades definidas en el DTO',
          clientInfo: {
            erroresValidacion,
          },
        })
      },
    })
  }
}

export function armarErroresValidacion(
  validationErrors: ValidationError[] = []
) {
  const erroresTextoPlano: string[] = []

  const parseErrors = (errors: ValidationError[], parentPath = '') => {
    return errors.reduce(
      (prev, curr) => {
        const propertyPath = parentPath
          ? `${parentPath}.${curr.property}`
          : curr.property

        if (curr.constraints) {
          const mensajes = Object.values(curr.constraints)
          erroresTextoPlano.push(
            ...mensajes.map((msg) => `${propertyPath} ${msg}`)
          )
          prev[propertyPath] = mensajes
        }

        if (curr.children && curr.children.length > 0) {
          Object.assign(prev, parseErrors(curr.children, propertyPath))
        }

        return prev
      },
      {} as Record<string, string[]>
    )
  }

  const result = parseErrors(validationErrors)
  return {
    erroresValidacion: result,
    erroresTextoPlano: erroresTextoPlano.join(' | '),
  }
}
