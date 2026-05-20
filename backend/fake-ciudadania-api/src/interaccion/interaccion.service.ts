import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { CiudadaniaUsuario } from '../database/entities/ciudadania-usuario.entity'
import { CiudadaniaOtp } from '../database/entities/ciudadania-otp.entity'
import { OidcService } from '../oidc/oidc.service'
import { EmailService } from './email.service'

@Injectable()
export class InteraccionService {
  constructor(
    @InjectRepository(CiudadaniaUsuario)
    private usuarioRepo: Repository<CiudadaniaUsuario>,
    @InjectRepository(CiudadaniaOtp)
    private otpRepo: Repository<CiudadaniaOtp>,
    private oidcService: OidcService,
    private emailService: EmailService
  ) {}

  /**
   * Valida CI + password, genera OTP y lo envía por email.
   * Devuelve el email enmascarado para mostrarlo en la página OTP.
   */
  async validarCredencialesYGenerarOtp(
    uid: string,
    ci: string,
    password: string
  ): Promise<{ emailMasked: string }> {
    // Verificar que la sesión existe y no expiró
    await this.oidcService.getSession(uid)

    const usuario = await this.usuarioRepo.findOne({ where: { ci, estado: 'ACTIVO' } })
    if (!usuario) {
      throw new UnauthorizedException('CI o contraseña incorrectos')
    }

    const passwordValido = await bcrypt.compare(password, usuario.passwordHash)
    if (!passwordValido) {
      throw new UnauthorizedException('CI o contraseña incorrectos')
    }

    // Invalida OTPs anteriores para esta interaction
    await this.otpRepo.update(
      { interactionUid: uid, usado: false },
      { usado: true }
    )

    // Genera OTP de 6 dígitos
    const codigo = String(Math.floor(100000 + Math.random() * 900000))
    const expiraEn = new Date(Date.now() + 150 * 1000) // 150 segundos

    await this.otpRepo.save({
      usuarioId: usuario.id,
      interactionUid: uid,
      codigo,
      expiraEn,
      usado: false,
    })

    // Registrar usuario en sesión
    await this.oidcService.setUsuarioEnSession(uid, usuario.id)

    // Enviar OTP
    const nombrePrimero = usuario.nombres.split(' ')[0]
    await this.emailService.enviarOtp(usuario.email, codigo, nombrePrimero)

    return { emailMasked: this.emailService.maskEmail(usuario.email) }
  }

  /**
   * Valida el código OTP de 6 dígitos.
   * Devuelve el redirect_uri con el authorization_code.
   */
  async validarOtp(
    uid: string,
    codigo: string
  ): Promise<{ redirectUri: string }> {
    // Verificar que la sesión existe
    const session = await this.oidcService.getSession(uid)

    if (!session.usuarioId) {
      throw new BadRequestException('Sesión incompleta: completá primero el paso de login')
    }

    const otp = await this.otpRepo.findOne({
      where: {
        interactionUid: uid,
        usuarioId: session.usuarioId,
        usado: false,
      },
      order: { creadoEn: 'DESC' },
    })

    if (!otp) {
      throw new UnauthorizedException('Código no encontrado o ya fue usado')
    }

    if (new Date() > otp.expiraEn) {
      throw new UnauthorizedException('El código expiró. Solicitá uno nuevo.')
    }

    if (otp.codigo !== codigo.trim()) {
      throw new UnauthorizedException('Código incorrecto')
    }

    // Marcar OTP como usado
    await this.otpRepo.update({ id: otp.id }, { usado: true })

    // Emitir authorization code
    return this.oidcService.emitirCode(uid)
  }

  /** Datos mínimos para renderizar la página de login */
  async getDatosLogin(uid: string): Promise<{ uid: string; clientName: string }> {
    await this.oidcService.getSession(uid)
    return {
      uid,
      clientName: 'Sistema FELCN',
    }
  }

  /** Datos para renderizar la página OTP */
  async getDatosOtp(
    uid: string
  ): Promise<{ uid: string; emailMasked: string }> {
    const session = await this.oidcService.getSession(uid)

    // Obtener el email del usuario si ya está en sesión
    let emailMasked = 'co***@m***.com'
    if (session.usuarioId) {
      const usuario = await this.usuarioRepo.findOne({
        where: { id: session.usuarioId },
      })
      if (usuario) {
        emailMasked = this.emailService.maskEmail(usuario.email)
      }
    }

    return { uid, emailMasked }
  }
}
