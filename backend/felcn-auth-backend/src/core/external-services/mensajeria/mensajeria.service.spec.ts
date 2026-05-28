import { Test, TestingModule } from '@nestjs/testing'
import { MensajeriaService } from './mensajeria.service'

describe('MensajeriaService', () => {
  let service: MensajeriaService

  beforeEach(async () => {
    process.env.SMTP_ENABLED = 'false'

    const module: TestingModule = await Test.createTestingModule({
      providers: [MensajeriaService],
    }).compile()

    service = module.get<MensajeriaService>(MensajeriaService)
    service.onModuleInit()
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
})
