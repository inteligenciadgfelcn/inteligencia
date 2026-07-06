import { of, throwError } from 'rxjs'
import { WhatsAppClient } from '../whatsapp.client'

const makeHttpService = (response?: object, error?: Error) => ({
  post: jest.fn().mockReturnValue(
    error ? throwError(() => error) : of({ data: response })
  ),
})

describe('WhatsAppClient', () => {
  beforeEach(() => {
    process.env.WHATSAPP_ACCESS_TOKEN = 'test-token'
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890'
    process.env.WHATSAPP_OTP_TEMPLATE_NAME = 'codigo_verificacion_felcn'
    process.env.WHATSAPP_API_VERSION = 'v21.0'
    process.env.WHATSAPP_GRAPH_BASE_URL = 'https://graph.facebook.com'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('isConfigured()', () => {
    it('devuelve true cuando todas las variables están definidas', () => {
      const client = new WhatsAppClient(makeHttpService() as any)
      expect(client.isConfigured()).toBe(true)
    })

    it('devuelve false cuando WHATSAPP_PHONE_NUMBER_ID está vacío', () => {
      process.env.WHATSAPP_PHONE_NUMBER_ID = ''
      const client = new WhatsAppClient(makeHttpService() as any)
      expect(client.isConfigured()).toBe(false)
    })

    it('devuelve false cuando WHATSAPP_ACCESS_TOKEN está vacío', () => {
      process.env.WHATSAPP_ACCESS_TOKEN = ''
      const client = new WhatsAppClient(makeHttpService() as any)
      expect(client.isConfigured()).toBe(false)
    })
  })

  describe('sendOtpTemplate()', () => {
    it('devuelve messageId en respuesta exitosa de Meta', async () => {
      const http = makeHttpService({ messages: [{ id: 'wamid.abc123' }] })
      const client = new WhatsAppClient(http as any)

      const result = await client.sendOtpTemplate('+59167890123', '123456')

      expect(result.messageId).toBe('wamid.abc123')
      expect(http.post).toHaveBeenCalledTimes(1)
    })

    it('llama a la URL correcta de la Graph API', async () => {
      const http = makeHttpService({ messages: [{ id: 'msg-1' }] })
      const client = new WhatsAppClient(http as any)

      await client.sendOtpTemplate('+59167890123', '654321')

      const [url] = http.post.mock.calls[0]
      expect(url).toBe(
        'https://graph.facebook.com/v21.0/1234567890/messages'
      )
    })

    it('incluye el código OTP en body y button del template', async () => {
      const http = makeHttpService({ messages: [{ id: 'msg-1' }] })
      const client = new WhatsAppClient(http as any)

      await client.sendOtpTemplate('+59167890123', '987654')

      const [, payload] = http.post.mock.calls[0]
      const components = payload.template.components
      expect(components[0].parameters[0].text).toBe('987654')
      expect(components[1].parameters[0].text).toBe('987654')
    })

    it('lanza error cuando Meta no devuelve message_id', async () => {
      const http = makeHttpService({ messages: [] })
      const client = new WhatsAppClient(http as any)

      await expect(
        client.sendOtpTemplate('+59167890123', '123456')
      ).rejects.toThrow('Meta no devolvió un message_id')
    })

    it('lanza error cuando Meta responde con error HTTP', async () => {
      const http = makeHttpService(undefined, new Error('Network error'))
      const client = new WhatsAppClient(http as any)

      await expect(
        client.sendOtpTemplate('+59167890123', '123456')
      ).rejects.toThrow('Network error')
    })
  })

  describe('normalizeToE164()', () => {
    let client: WhatsAppClient

    beforeEach(() => {
      client = new WhatsAppClient(makeHttpService() as any)
    })

    it('agrega +591 a número boliviano de 8 dígitos (empieza en 6)', () => {
      expect(client.normalizeToE164('60990413')).toBe('+59160990413')
    })

    it('agrega +591 a número boliviano de 8 dígitos (empieza en 7)', () => {
      expect(client.normalizeToE164('71234567')).toBe('+59171234567')
    })

    it('preserva número ya en formato E.164', () => {
      expect(client.normalizeToE164('+59167890123')).toBe('+59167890123')
    })

    it('normaliza número con prefijo 591 sin +', () => {
      expect(client.normalizeToE164('59167890123')).toBe('+59167890123')
    })

    it('elimina espacios y guiones antes de normalizar', () => {
      expect(client.normalizeToE164('6099 0413')).toBe('+59160990413')
    })
  })
})
