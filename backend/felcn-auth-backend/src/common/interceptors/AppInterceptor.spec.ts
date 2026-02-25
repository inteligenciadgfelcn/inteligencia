import 'reflect-metadata'
import type { AppInterceptor as AppInterceptorType } from './AppInterceptor'
import {
  CallHandler,
  ExecutionContext,
  RequestTimeoutException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { LoggerService } from '@/core/logger'
import { Request, Response } from 'express'
import { lastValueFrom, NEVER, of, throwError } from 'rxjs'

type RequestWithStartTime = Request & { startTime?: number }

const createExecutionContext = (
  request: RequestWithStartTime,
  response: Response
): ExecutionContext => {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
    getHandler: () => jest.fn(),
  } as unknown as ExecutionContext
}

describe('AppInterceptor', () => {
  let AppInterceptorClass: new (reflector: Reflector) => AppInterceptorType
  let interceptor: AppInterceptorType
  const loggerMock = {
    audit: jest.fn(),
  } as unknown as jest.Mocked<Pick<LoggerService, 'audit'>>
  let reflectorMock: jest.Mocked<Pick<Reflector, 'get'>>
  let isDebugEnabledSpy: jest.SpyInstance

  const createRequest = (): RequestWithStartTime =>
    ({
      method: 'GET',
      originalUrl: '/recurso/123?filtro=true',
      startTime: Date.now() - 5,
    }) as unknown as RequestWithStartTime

  const createResponse = () =>
    ({
      statusCode: 202,
    }) as unknown as Response

  beforeAll(async () => {
    jest
      .spyOn(LoggerService, 'getInstance')
      .mockReturnValue(loggerMock as unknown as LoggerService)

    const module = await import('./AppInterceptor')
    AppInterceptorClass = module.AppInterceptor
  })

  beforeEach(() => {
    loggerMock.audit.mockClear()

    isDebugEnabledSpy = jest
      .spyOn(LoggerService, 'isDebugEnabled')
      .mockReturnValue(false)

    reflectorMock = {
      get: jest.fn(),
    } as unknown as jest.Mocked<Pick<Reflector, 'get'>>

    interceptor = new AppInterceptorClass(reflectorMock as unknown as Reflector)
  })

  afterEach(() => {
    isDebugEnabledSpy.mockRestore()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('audita la respuesta con metadatos básicos', async () => {
    const request = createRequest()
    const response = createResponse()
    const context = createExecutionContext(request, response)
    const callHandler: CallHandler = {
      handle: () => of({ resultado: 'ok' }),
    }

    await lastValueFrom(interceptor.intercept(context, callHandler))

    expect(loggerMock.audit).toHaveBeenCalledWith(
      'response',
      expect.objectContaining({
        metadata: expect.objectContaining({
          status: response.statusCode,
          method: request.method,
          url: '/recurso/123',
        }),
      })
    )

    const [, auditPayload] = loggerMock.audit.mock.calls[0] || []
    expect(auditPayload).toBeDefined()
    const metadata = (auditPayload as { metadata?: Record<string, any> })
      ?.metadata as Record<string, unknown>
    expect(metadata).toBeDefined()
    expect(metadata.elapsedTimeMs).toBeGreaterThanOrEqual(0)
    expect(metadata).not.toHaveProperty('data')
  })

  it('expone la carga de respuesta cuando la depuración está activa', async () => {
    isDebugEnabledSpy.mockReturnValue(true)

    const request = createRequest()
    const response = createResponse()
    const context = createExecutionContext(request, response)
    const body = { foo: 'bar' }
    const callHandler: CallHandler = {
      handle: () => of(body),
    }

    await lastValueFrom(interceptor.intercept(context, callHandler))

    expect(loggerMock.audit).toHaveBeenCalledWith(
      'response',
      expect.objectContaining({
        metadata: expect.objectContaining({ data: body }),
      })
    )
  })

  it('convierte los timeouts en RequestTimeoutException', async () => {
    reflectorMock.get.mockReturnValue(0.001)

    const request = createRequest()
    const response = createResponse()
    const context = createExecutionContext(request, response)
    const callHandler: CallHandler = {
      handle: () => NEVER,
    }

    await expect(
      lastValueFrom(interceptor.intercept(context, callHandler))
    ).rejects.toMatchObject({
      constructor: RequestTimeoutException,
      cause: expect.stringContaining('0.001'),
    })
  })

  it('reemite los errores no relacionados a timeout sin modificaciones', async () => {
    const request = createRequest()
    const response = createResponse()
    const context = createExecutionContext(request, response)

    const originalError = new Error('boom')
    const callHandler: CallHandler = {
      handle: () => throwError(() => originalError),
    }

    await expect(
      lastValueFrom(interceptor.intercept(context, callHandler))
    ).rejects.toBe(originalError)
  })
})
