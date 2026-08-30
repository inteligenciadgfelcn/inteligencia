import { BadRequestException } from '@nestjs/common'
import { Messages } from '../constants/response-messages'
import { SuccessResponseDto } from './success-response.dto'

type ListaCantidadType<T> = [Array<T>, number]

export abstract class AbstractController {
  makeResponse<T>(data: T, message: string): SuccessResponseDto<T> {
    const body = {
      finalizado: true,
      mensaje: message,
      datos: data,
    }
    return body
  }

  success<T>(
    data: T,
    message = Messages.SUCCESS_DEFAULT
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successList<T>(
    data: T,
    message = Messages.SUCCESS_LIST
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successUpdate<T>(
    data: T,
    message = Messages.SUCCESS_UPDATE
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successDelete<T>(
    data?: T,
    message = Messages.SUCCESS_DELETE
  ): SuccessResponseDto<T> {
    return this.makeResponse((data ?? null) as unknown as T, message)
  }

  successCreate<T>(
    data: T,
    message = Messages.SUCCESS_CREATE
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successListRows<T>(
    data: ListaCantidadType<T>,
    message = Messages.SUCCESS_LIST
  ): SuccessResponseDto<{ total: number; filas: Array<T> }> {
    const [filas, total] = data
    return this.makeResponse({ total, filas }, message)
  }

  successPagedRows<T>(
    data: ListaCantidadType<T>,
    paginacion: { pagina?: number; limite?: number },
    message = Messages.SUCCESS_LIST
  ): SuccessResponseDto<{
    filas: Array<T>
    page: {
      size: number
      number: number
      totalElements: number
      totalPages: number
    }
  }> {
    const [filas, totalElements] = data
    const size = paginacion?.limite ?? 10
    const number = paginacion?.pagina ?? 1
    const totalPages = size > 0 ? Math.ceil(totalElements / size) : 1
    return this.makeResponse(
      { filas, page: { size, number, totalElements, totalPages } },
      message
    )
  }

  getUser(req) {
    if (req?.user?.id) {
      return req.user.id
    }
    throw new BadRequestException(
      `Es necesario que esté autenticado para consumir este recurso.`
    )
  }
}
