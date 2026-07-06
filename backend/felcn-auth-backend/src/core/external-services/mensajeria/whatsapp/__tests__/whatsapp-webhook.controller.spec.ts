import { Test, TestingModule } from '@nestjs/testing'
import { WhatsAppWebhookController } from '../whatsapp-webhook.controller'
import { WhatsAppWebhookService } from '../whatsapp-webhook.service'

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
})

describe('WhatsAppWebhookController', () => {
  let controller: WhatsAppWebhookController
  let webhookService: { procesarEventos: jest.Mock }

  beforeEach(async () => {
    process.env.WHATSAPP_VERIFY_TOKEN =
      'DTRehGp_ERpnoLSyniVRJkLDsaU3bVVucNVee_UPR3I'

    webhookService = {
      procesarEventos: jest.fn().mockResolvedValue(undefined),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsAppWebhookController],
      providers: [
        { provide: WhatsAppWebhookService, useValue: webhookService },
      ],
    }).compile()

    controller = module.get<WhatsAppWebhookController>(WhatsAppWebhookController)
  })

  afterEach(() => jest.clearAllMocks())

  describe('GET /whatsapp/webhook — handshake Meta', () => {
    it('responde 200 con el challenge cuando el token es correcto', () => {
      const res = makeRes()
      controller.verificar(
        'subscribe',
        'DTRehGp_ERpnoLSyniVRJkLDsaU3bVVucNVee_UPR3I',
        'challenge-xyz',
        res as any
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith('challenge-xyz')
    })

    it('responde 403 cuando el token es incorrecto', () => {
      const res = makeRes()
      controller.verificar(
        'subscribe',
        'token-incorrecto',
        'challenge-xyz',
        res as any
      )
      expect(res.status).toHaveBeenCalledWith(403)
    })

    it('responde 403 cuando el mode no es subscribe', () => {
      const res = makeRes()
      controller.verificar(
        'unsubscribe',
        'DTRehGp_ERpnoLSyniVRJkLDsaU3bVVucNVee_UPR3I',
        'challenge-xyz',
        res as any
      )
      expect(res.status).toHaveBeenCalledWith(403)
    })
  })

  describe('POST /whatsapp/webhook — recepción de eventos', () => {
    it('responde 200 de inmediato', async () => {
      const res = makeRes()
      await controller.recibirEvento({ entry: [] }, res as any)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith('OK')
    })

    it('llama a procesarEventos con el body recibido', async () => {
      const res = makeRes()
      const body = { entry: [{ changes: [] }] }
      await controller.recibirEvento(body, res as any)
      // procesarEventos se invoca de forma async — esperar el micro-task
      await Promise.resolve()
      expect(webhookService.procesarEventos).toHaveBeenCalledWith(body)
    })

    it('no propaga errores del procesamiento asíncrono', async () => {
      webhookService.procesarEventos.mockRejectedValueOnce(
        new Error('Error interno')
      )
      const res = makeRes()
      await expect(
        controller.recibirEvento({}, res as any)
      ).resolves.toBeUndefined()
    })
  })
})
