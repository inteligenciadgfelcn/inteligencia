import { LoggerMiddleware } from './LoggerMiddleware'
import { LoggerService } from '@/core/logger'
import { Request, Response } from 'express'

type RequestWithExtras = Request & {
  startTime?: number
  query?: Record<string, unknown>
  body?: Record<string, unknown>
}

const createRequest = (
  overrides: Partial<RequestWithExtras> = {}
): RequestWithExtras =>
  ({
    method: 'POST',
    originalUrl: '/api/resource?flag=true',
    headers: { 'user-agent': 'jest' },
    ip: '127.0.0.1',
    query: {},
    body: {},
    ...overrides,
  }) as unknown as RequestWithExtras

describe('LoggerMiddleware', () => {
  let LoggerMiddlewareClass: new () => LoggerMiddleware
  const loggerMock = {
    audit: jest.fn(),
  } as unknown as jest.Mocked<Pick<LoggerService, 'audit'>>
  let middleware: LoggerMiddleware
  let debugSpy: jest.SpyInstance

  beforeAll(async () => {
    jest
      .spyOn(LoggerService, 'getInstance')
      .mockReturnValue(loggerMock as unknown as LoggerService)

    const module = await import('./LoggerMiddleware')
    LoggerMiddlewareClass = module.LoggerMiddleware
  })

  beforeEach(() => {
    loggerMock.audit.mockClear()
    debugSpy = jest
      .spyOn(LoggerService, 'isDebugEnabled')
      .mockReturnValue(false)
    middleware = new LoggerMiddlewareClass()
  })

  afterEach(() => {
    debugSpy.mockRestore()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('registra el tiempo de inicio y audita los metadatos básicos', () => {
    const req = createRequest()
    const next = jest.fn()

    middleware.use(req, {} as Response, next)

    expect(req.startTime).toBeDefined()
    expect(loggerMock.audit).toHaveBeenCalledWith(
      'request',
      expect.objectContaining({
        metadata: expect.objectContaining({
          method: req.method,
          url: '/api/resource',
          ip: req.ip,
          useragent: 'jest',
        }),
      })
    )
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('incluye query y body cuando el modo depuración está activo', () => {
    debugSpy.mockReturnValue(true)

    const req = createRequest({
      query: { page: '1' },
      body: { name: 'demo' },
    })
    const next = jest.fn()

    middleware.use(req, {} as Response, next)

    const [, auditPayload] = loggerMock.audit.mock.calls[0] || []
    expect(auditPayload).toBeDefined()
    const metadata = (auditPayload as { metadata?: Record<string, unknown> })
      ?.metadata
    expect(metadata).toBeDefined()
    expect(metadata?.query).toEqual({ page: '1' })
    expect(metadata?.body).toEqual({ name: 'demo' })
  })
})
