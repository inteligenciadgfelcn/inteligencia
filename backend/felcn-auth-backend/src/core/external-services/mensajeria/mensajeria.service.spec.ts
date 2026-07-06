import { Test, TestingModule } from '@nestjs/testing'
import { MensajeriaService } from './mensajeria.service'
import { WhatsAppChannel } from './whatsapp/whatsapp.channel'

const mockWhatsAppChannel = {
  enviar: jest.fn().mockResolvedValue({ messageId: '', exito: false, error: 'WhatsApp no configurado' }),
  nombre: jest.fn().mockReturnValue('whatsapp'),
}

describe('MensajeriaService', () => {
  let service: MensajeriaService

  beforeEach(async () => {
    process.env.SMTP_ENABLED = 'false'

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MensajeriaService,
        { provide: WhatsAppChannel, useValue: mockWhatsAppChannel },
      ],
    }).compile()

    service = module.get<MensajeriaService>(MensajeriaService)
    service.onModuleInit()
  })

  afterEach(() => jest.clearAllMocks())

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
