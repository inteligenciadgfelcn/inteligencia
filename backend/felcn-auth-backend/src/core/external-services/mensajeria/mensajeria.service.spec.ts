import { Test, TestingModule } from '@nestjs/testing'
import { MensajeriaService } from './mensajeria.service'
import { WhatsAppChannel } from './whatsapp/whatsapp.channel'
import { LoggerService } from '@/core/logger'

const sendMailMock = jest.fn()
const createTransportMock = jest.fn(() => ({ sendMail: sendMailMock }))
jest.mock('nodemailer', () => ({
  createTransport: () => createTransportMock(),
}))

const mockWhatsAppChannel = {
  enviar: jest.fn().mockResolvedValue({ messageId: '', exito: false, error: 'WhatsApp no configurado' }),
  nombre: jest.fn().mockReturnValue('whatsapp'),
}

const ENV_SMTP_KEYS = [
  'SMTP_ENABLED',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_BACKUP1_USER',
  'SMTP_BACKUP1_PASS',
  'SMTP_BACKUP2_USER',
  'SMTP_BACKUP2_PASS',
]

async function crearServicio(): Promise<MensajeriaService> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      MensajeriaService,
      { provide: WhatsAppChannel, useValue: mockWhatsAppChannel },
    ],
  }).compile()

  const service = module.get<MensajeriaService>(MensajeriaService)
  service.onModuleInit()
  return service
}

describe('MensajeriaService', () => {
  let service: MensajeriaService

  beforeEach(async () => {
    process.env.SMTP_ENABLED = 'false'

    service = await crearServicio()
  })

  afterEach(() => {
    jest.clearAllMocks()
    ENV_SMTP_KEYS.forEach((key) => delete process.env[key])
  })

  it('[sendEmail] Debería completar sin errores cuando SMTP está deshabilitado.', async () => {
    await expect(
      service.sendEmail('fake@fake.bo', 'asunto', '<p>contenido</p>')
    ).resolves.toBeUndefined()
  })

  it('[sendSms] Debería completar sin errores (SMS no disponible via SMTP).', async () => {
    await expect(
      service.sendSms('77777777', 'mensaje de prueba')
    ).resolves.toBeUndefined()
  })

  it('[sendWhatsapp] Completa sin lanzar error cuando WhatsApp no está configurado.', async () => {
    await expect(
      service.sendWhatsapp('60990413', '123456', '1')
    ).resolves.toBeUndefined()
    expect(mockWhatsAppChannel.enviar).toHaveBeenCalledWith('60990413', '123456', '1')
  })
})

describe('MensajeriaService — failover de canales SMTP', () => {
  beforeEach(() => {
    sendMailMock.mockReset()
    createTransportMock.mockClear()

    process.env.SMTP_ENABLED = 'true'
    process.env.SMTP_USER = 'primario@felcn.gob.bo'
    process.env.SMTP_PASS = 'clave-primario'
    process.env.SMTP_BACKUP1_USER = 'respaldo1@gmail.com'
    process.env.SMTP_BACKUP1_PASS = 'clave-respaldo1'
    process.env.SMTP_BACKUP2_USER = 'respaldo2@gmail.com'
    process.env.SMTP_BACKUP2_PASS = 'clave-respaldo2'
  })

  afterEach(() => {
    jest.restoreAllMocks()
    ENV_SMTP_KEYS.forEach((key) => delete process.env[key])
  })

  it('usa el canal primario cuando funciona, sin tocar los de respaldo', async () => {
    sendMailMock.mockResolvedValueOnce({})
    const service = await crearServicio()

    await service.sendEmail('destino@fake.bo', 'asunto', '<p>hola</p>')

    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it('cae al primer respaldo si el canal primario falla', async () => {
    sendMailMock
      .mockRejectedValueOnce(new Error('EHOSTUNREACH primario'))
      .mockResolvedValueOnce({})
    const service = await crearServicio()

    await service.sendEmail('destino@fake.bo', 'asunto', '<p>hola</p>')

    expect(sendMailMock).toHaveBeenCalledTimes(2)
  })

  it('cae al segundo respaldo si el primario y el primer respaldo fallan', async () => {
    sendMailMock
      .mockRejectedValueOnce(new Error('falla primario'))
      .mockRejectedValueOnce(new Error('falla respaldo 1'))
      .mockResolvedValueOnce({})
    const service = await crearServicio()

    await service.sendEmail('destino@fake.bo', 'asunto', '<p>hola</p>')

    expect(sendMailMock).toHaveBeenCalledTimes(3)
  })

  it('lanza el último error si fallan los 3 canales', async () => {
    sendMailMock
      .mockRejectedValueOnce(new Error('falla primario'))
      .mockRejectedValueOnce(new Error('falla respaldo 1'))
      .mockRejectedValueOnce(new Error('falla respaldo 2'))
    const service = await crearServicio()

    await expect(
      service.sendEmail('destino@fake.bo', 'asunto', '<p>hola</p>')
    ).rejects.toThrow('falla respaldo 2')
    expect(sendMailMock).toHaveBeenCalledTimes(3)
  })

  it('registra una auditoría crítica (auditError) cuando fallan los 3 canales', async () => {
    const auditErrorSpy = jest.spyOn(LoggerService.getInstance(), 'auditError')
    sendMailMock
      .mockRejectedValueOnce(new Error('falla primario'))
      .mockRejectedValueOnce(new Error('falla respaldo 1'))
      .mockRejectedValueOnce(new Error('falla respaldo 2'))
    const service = await crearServicio()

    await expect(
      service.sendEmail('destino@fake.bo', 'asunto', '<p>hola</p>')
    ).rejects.toThrow('falla respaldo 2')

    expect(auditErrorSpy).toHaveBeenCalledWith(
      'mensajeria',
      expect.stringContaining('Correo NO entregado'),
      expect.objectContaining({
        para: 'destino@fake.bo',
        asunto: 'asunto',
        canalesIntentados: ['primario', 'respaldo-1', 'respaldo-2'],
        error: 'falla respaldo 2',
      })
    )
    auditErrorSpy.mockRestore()
  })

  it('omite un canal de respaldo sin credenciales configuradas', async () => {
    delete process.env.SMTP_BACKUP2_USER
    delete process.env.SMTP_BACKUP2_PASS
    sendMailMock
      .mockRejectedValueOnce(new Error('falla primario'))
      .mockResolvedValueOnce({})
    const service = await crearServicio()

    await service.sendEmail('destino@fake.bo', 'asunto', '<p>hola</p>')

    expect(sendMailMock).toHaveBeenCalledTimes(2)
  })
})
