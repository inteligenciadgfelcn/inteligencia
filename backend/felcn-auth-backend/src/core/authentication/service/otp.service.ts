import { BaseService } from '@/common/base'
import { Configurations } from '@/common/params'
import { TextService } from '@/common/lib/text.service'
import { TemplateEmailService } from '@/common/templates/templates-email.service'
import { MensajeriaService } from '@/core/external-services/mensajeria/mensajeria.service'
import { UsuarioRepository } from '@/core/usuario/repository/usuario.repository'
import { Usuario } from '@/core/usuario/entity/usuario.entity'
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { OtpSesionRepository } from '../repository/otp-sesion.repository'
import dayjs from 'dayjs'

export const OtpCanal = {
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
} as const

export type ResultadoInicioOtp =
  | { necesita: false }
  | { necesita: true; otpSesionId: string; destinoOfuscado: string; canal: string }

@Injectable()
export class OtpService extends BaseService {
  constructor(
    private readonly otpSesionRepository: OtpSesionRepository,
    private readonly usuarioRepository: UsuarioRepository,
    private readonly mensajeriaService: MensajeriaService
  ) {
    super()
  }

  /**
   * Evalúa si el usuario requiere OTP. Si es así, genera y envía el código.
   * Llamar desde el controller de login después de que Passport valide las credenciales.
   */
  async iniciarOtp(idUsuario: string): Promise<ResultadoInicioOtp> {
    const usuario = await this.usuarioRepository.buscarPorId(idUsuario)

    if (!usuario?.otpHabilitado) {
      return { necesita: false }
    }

    const { otpSesionId, destinoOfuscado, canal } =
      await this.generarYEnviar(usuario)

    return { necesita: true, otpSesionId, destinoOfuscado, canal }
  }

  /**
   * Verifica el código OTP recibido contra la sesión almacenada.
   * Devuelve el idUsuario si la verificación es correcta.
   */
  async verificar(otpSesionId: string, codigo: string): Promise<string> {
    const sesion = await this.otpSesionRepository.buscarPorId(otpSesionId)

    if (!sesion) {
      throw new UnauthorizedException('Sesión OTP no encontrada.')
    }
    if (sesion.consumido) {
      throw new UnauthorizedException('El código OTP ya fue utilizado.')
    }
    if (dayjs().isAfter(sesion.expiracion)) {
      throw new UnauthorizedException('El código OTP ha expirado. Solicite uno nuevo.')
    }
    if (sesion.intentos >= Configurations.OTP_MAX_INTENTOS) {
      throw new UnauthorizedException(
        'Número máximo de intentos superado. Solicite un nuevo código.'
      )
    }

    const esValido = await TextService.compare(codigo, sesion.codigoHash)

    if (!esValido) {
      await this.otpSesionRepository.incrementarIntentos(otpSesionId)
      const restantes = Configurations.OTP_MAX_INTENTOS - (sesion.intentos + 1)
      throw new UnauthorizedException(
        restantes > 0
          ? `Código incorrecto. Intentos restantes: ${restantes}.`
          : 'Código incorrecto. No quedan más intentos. Solicite un nuevo código.'
      )
    }

    await this.otpSesionRepository.consumir(otpSesionId)
    this.otpSesionRepository.limpiarExpiradas().catch(() => undefined)

    this.logger.audit('otp', {
      mensaje: 'OTP verificado correctamente',
      metadata: { idUsuario: sesion.idUsuario, canal: sesion.canal },
    })

    return sesion.idUsuario
  }

  // ─── Privados ───────────────────────────────────────────────────────────────

  private async generarYEnviar(usuario: Usuario) {
    // Rate limiting: un OTP por ventana de tiempo
    const recientes = await this.otpSesionRepository.contarRecientesDeUsuario(
      usuario.id,
      Configurations.OTP_RATE_LIMIT_SEGUNDOS
    )
    if (recientes >= 1) {
      throw new HttpException(
        `Debe esperar ${Configurations.OTP_RATE_LIMIT_SEGUNDOS} segundos antes de solicitar un nuevo código.`,
        HttpStatus.TOO_MANY_REQUESTS
      )
    }

    // Invalidar sesiones pendientes anteriores del usuario
    await this.otpSesionRepository.invalidarPendientes(usuario.id)

    const codigo = TextService.generateNumericOtp(Configurations.OTP_LONGITUD)
    const codigoHash = await TextService.encrypt(codigo)

    const canal: string = usuario.otpCanal ?? Configurations.OTP_CANAL_DEFAULT
    const destino =
      canal === OtpCanal.WHATSAPP
        ? (usuario.telefonoCelular ?? usuario.telefonoCorporativo ?? '')
        : (usuario.correoElectronico ?? '')

    if (!destino) {
      throw new HttpException(
        `El usuario no tiene ${canal === OtpCanal.WHATSAPP ? 'número de teléfono' : 'correo electrónico'} registrado para el envío del OTP.`,
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }

    const expiracion = dayjs()
      .add(Configurations.OTP_EXPIRACION_MIN, 'minute')
      .toDate()

    const sesion = await this.otpSesionRepository.crear({
      idUsuario: usuario.id,
      codigoHash,
      canal,
      destino,
      expiracion,
    })

    await this.enviarCodigo(canal, destino, codigo)

    this.logger.audit('otp', {
      mensaje: 'OTP generado y enviado',
      metadata: {
        idUsuario: usuario.id,
        canal,
        destino: this.ofuscarDestino(destino, canal),
      },
    })

    return {
      otpSesionId: sesion.id,
      destinoOfuscado: this.ofuscarDestino(destino, canal),
      canal,
    }
  }

  private async enviarCodigo(
    canal: string,
    destino: string,
    codigo: string
  ): Promise<void> {
    if (canal === OtpCanal.WHATSAPP) {
      await this.mensajeriaService.sendWhatsapp(
        destino,
        `Tu código de verificación FELCN es: *${codigo}*. ` +
          `Válido por ${Configurations.OTP_EXPIRACION_MIN} minutos. ` +
          `No lo compartas con nadie.`
      )
    } else {
      const template = TemplateEmailService.armarPlantillaOtp(
        codigo,
        Configurations.OTP_EXPIRACION_MIN
      )
      await this.mensajeriaService.sendEmail(
        destino,
        'Código de verificación — Sistema FELCN',
        template
      )
    }
  }

  private ofuscarDestino(destino: string, canal: string): string {
    if (canal === OtpCanal.WHATSAPP) {
      return destino.replace(/(\d{3})\d+(\d{2})$/, '$1***$2')
    }
    const [local, domain] = destino.split('@')
    if (!domain) return '***'
    const visible = local.substring(0, Math.min(2, local.length))
    return `${visible}***@${domain}`
  }
}
