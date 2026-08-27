import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { OtpService } from './otp.service'
import { OtpSesionRepository } from '../repository/otp-sesion.repository'
import { UsuarioRepository } from '@/core/usuario/repository/usuario.repository'
import { MensajeriaService } from '@/core/external-services/mensajeria/mensajeria.service'

describe('OtpService — dispositivo de confianza', () => {
  let service: OtpService
  let usuarioRepository: { buscarPorId: jest.Mock }

  beforeEach(async () => {
    usuarioRepository = { buscarPorId: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        { provide: OtpSesionRepository, useValue: {} },
        { provide: UsuarioRepository, useValue: usuarioRepository },
        { provide: MensajeriaService, useValue: {} },
        {
          provide: JwtService,
          useValue: new JwtService({ secret: 'test-secret' }),
        },
      ],
    }).compile()

    service = module.get(OtpService)
  })

  it('genera un token que se verifica como confiable para el mismo usuario', async () => {
    usuarioRepository.buscarPorId.mockResolvedValue({
      sesionesRevocadasDesde: null,
    })

    const token = service.generarTokenConfianza('42')

    await expect(service.esDispositivoConfiable('42', token)).resolves.toBe(
      true
    )
  })

  it('rechaza si no hay token', async () => {
    await expect(
      service.esDispositivoConfiable('42', undefined)
    ).resolves.toBe(false)
  })

  it('rechaza un token de otro usuario', async () => {
    usuarioRepository.buscarPorId.mockResolvedValue({
      sesionesRevocadasDesde: null,
    })
    const token = service.generarTokenConfianza('42')

    await expect(service.esDispositivoConfiable('99', token)).resolves.toBe(
      false
    )
  })

  it('rechaza un token con firma inválida', async () => {
    await expect(
      service.esDispositivoConfiable('42', 'token-invalido')
    ).resolves.toBe(false)
  })

  it('rechaza un token emitido antes de la última revocación de sesiones', async () => {
    const token = service.generarTokenConfianza('42')
    usuarioRepository.buscarPorId.mockResolvedValue({
      // revocado "ahora", claramente posterior al iat del token recién firmado
      sesionesRevocadasDesde: new Date(Date.now() + 60_000),
    })

    await expect(service.esDispositivoConfiable('42', token)).resolves.toBe(
      false
    )
  })
})
