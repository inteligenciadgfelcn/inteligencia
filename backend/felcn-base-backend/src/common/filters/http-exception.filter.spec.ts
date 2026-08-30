import {
  ArgumentsHost,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { HttpExceptionFilter } from './http-exception.filter'
import { LoggerService } from '@/core/logger'
import { Request, Response } from 'express'

type RequestWithStartTime = Request & { startTime?: number }

const createArgumentsHost = (
  request: RequestWithStartTime,
  response: Response
): ArgumentsHost => {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as unknown as ArgumentsHost
}

const createRequest = (): RequestWithStartTime =>
  ({
    method: 'GET',
    originalUrl: '/ruta/prueba?param=1',
    headers: { authorization: 'Bearer token' },
    params: { id: '123' },
    query: { param: '1' },
    body: { campo: 'valor' },
    user: { id: 'usuario-1' },
    startTime: Date.now() - 25,
  }) as unknown as RequestWithStartTime

describe('HttpExceptionFilter', () => {
  let responseMock: Response
  let statusMock: jest.Mock
  let jsonMock: jest.Mock

  let filter: HttpExceptionFilter
  let loggerMock: jest.Mocked<
    Pick<LoggerService, 'error' | 'auditWarn' | 'auditError'>
  >

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis()
    jsonMock = jest.fn()
    responseMock = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response

    loggerMock = {
      error: jest.fn(),
      auditWarn: jest.fn(),
      auditError: jest.fn(),
    } as unknown as jest.Mocked<
      Pick<LoggerService, 'error' | 'auditWarn' | 'auditError'>
    >

    jest
      .spyOn(LoggerService, 'getInstance')
      .mockReturnValue(loggerMock as unknown as LoggerService)

    filter = new HttpExceptionFilter()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('mapea excepciones HTTP a respuestas estructuradas y registra advertencias', () => {
    const request = createRequest()
    const host = createArgumentsHost(request, responseMock)
    const exception = new BadRequestException({ motivo: 'dato incorrecto' })

    filter.catch(exception, host)

    expect(loggerMock.error).toHaveBeenCalled()
    expect(loggerMock.auditWarn).toHaveBeenCalledWith(
      'response',
      expect.objectContaining({
        metadata: expect.objectContaining({
          status: 400,
          method: request.method,
          url: '/ruta/prueba',
        }),
      })
    )
    expect(loggerMock.auditError).not.toHaveBeenCalled()
    expect(statusMock).toHaveBeenCalledWith(400)
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: 400,
        finalizado: false,
        mensaje: expect.any(String),
      })
    )
  })

  it('registra los errores de servidor como eventos de error', () => {
    const request = createRequest()
    const host = createArgumentsHost(request, responseMock)
    const exception = new InternalServerErrorException({ detalle: 'fallo' })

    filter.catch(exception, host)

    expect(loggerMock.auditError).toHaveBeenCalledWith(
      'response',
      expect.objectContaining({
        metadata: expect.objectContaining({
          status: 500,
          method: request.method,
        }),
      })
    )
    const payload = jsonMock.mock.calls[0][0]
    expect(payload.codigo).toBe(500)
    expect(payload.finalizado).toBe(false)
    expect(payload.mensaje).toEqual(expect.any(String))
    expect(statusMock).toHaveBeenCalledWith(500)
    expect(jsonMock).toHaveBeenCalled()
    expect(loggerMock.auditWarn).not.toHaveBeenCalled()
  })
})
