import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { CiudadaniaSession } from '../database/entities/ciudadania-session.entity'
import { CiudadaniaUsuario } from '../database/entities/ciudadania-usuario.entity'
import { JwtService } from './jwt.service'

@Injectable()
export class OidcService {
  constructor(
    @InjectRepository(CiudadaniaSession)
    private sessionRepo: Repository<CiudadaniaSession>,
    @InjectRepository(CiudadaniaUsuario)
    private usuarioRepo: Repository<CiudadaniaUsuario>,
    private jwtService: JwtService
  ) {}

  /** Crea una sesión OIDC y devuelve el interaction_uid */
  async crearSession(params: Record<string, string>): Promise<string> {
    const interactionUid = uuidv4()
    const expiraEn = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

    await this.sessionRepo.save({
      interactionUid,
      params,
      usuarioId: null,
      codeHash: null,
      codeUsado: false,
      expiraEn,
    })

    return interactionUid
  }

  /** Obtiene la sesión por UID, lanza excepción si expiró */
  async getSession(uid: string): Promise<CiudadaniaSession> {
    const session = await this.sessionRepo.findOne({ where: { interactionUid: uid } })
    if (!session) {
      throw new BadRequestException('Sesión no encontrada')
    }
    if (new Date() > session.expiraEn) {
      throw new BadRequestException('La sesión expiró, iniciá el proceso nuevamente')
    }
    return session
  }

  /**
   * Registra el usuario autenticado en la sesión (después de validar CI + password).
   * Devuelve el interaction_uid para la siguiente etapa.
   */
  async setUsuarioEnSession(uid: string, usuarioId: string): Promise<void> {
    await this.sessionRepo.update({ interactionUid: uid }, { usuarioId })
  }

  /**
   * Emite el authorization_code después de validar el OTP.
   * Guarda el hash en la sesión y devuelve el code real + redirect_uri con state.
   */
  async emitirCode(uid: string): Promise<{ redirectUri: string }> {
    const session = await this.getSession(uid)

    const code = uuidv4() // code real (se devuelve una sola vez)
    const codeHash = this.jwtService.hashCode(code)

    // Extiende la expiración 5 minutos para dar tiempo al intercambio de tokens
    const nuevaExpiracion = new Date(Date.now() + 5 * 60 * 1000)
    await this.sessionRepo.update(
      { interactionUid: uid },
      { codeHash, codeUsado: false, expiraEn: nuevaExpiracion }
    )

    const { redirect_uri, state } = session.params
    const url = new URL(redirect_uri)
    url.searchParams.set('code', code)
    if (state) url.searchParams.set('state', state)

    return { redirectUri: url.toString() }
  }

  /**
   * Token endpoint: intercambia el code por access_token + id_token.
   * El code solo puede usarse una vez.
   */
  async intercambiarCode(code: string): Promise<{
    access_token: string
    id_token: string
    token_type: string
    expires_in: number
    scope: string
  }> {
    const codeHash = this.jwtService.hashCode(code)

    const session = await this.sessionRepo.findOne({ where: { codeHash } })
    if (!session) {
      throw new UnauthorizedException('Code inválido')
    }
    if (session.codeUsado) {
      throw new UnauthorizedException('El code ya fue usado')
    }
    if (new Date() > session.expiraEn) {
      throw new UnauthorizedException('El code expiró')
    }
    if (!session.usuarioId) {
      throw new UnauthorizedException('Sesión incompleta')
    }

    await this.sessionRepo.update({ id: session.id }, { codeUsado: true })

    const { client_id, nonce } = session.params

    const accessToken = await this.jwtService.signAccessToken(
      { sub: session.usuarioId, scope: session.params.scope || 'openid' },
      '1h'
    )

    const idToken = await this.jwtService.signIdToken(
      session.usuarioId,
      client_id,
      nonce || undefined,
    )

    return {
      access_token: accessToken,
      id_token: idToken,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: session.params.scope || 'openid',
    }
  }

  /**
   * Userinfo endpoint: devuelve los datos en el formato exacto que espera oidc.strategy.ts
   */
  async getUserinfo(accessToken: string): Promise<object> {
    let payload: Record<string, unknown>
    try {
      payload = await this.jwtService.verifyAccessToken(accessToken)
    } catch {
      throw new UnauthorizedException('Token inválido o expirado')
    }

    const sub = payload.sub as string
    const usuario = await this.usuarioRepo.findOne({ where: { id: sub } })
    if (!usuario || usuario.estado !== 'ACTIVO') {
      throw new UnauthorizedException('Usuario no encontrado o inactivo')
    }

    // Estructura exacta que espera oidc.strategy.ts
    return {
      sub: usuario.id,
      profile: {
        documento_identidad: {
          tipo_documento: usuario.tipoDocumento,
          numero_documento: usuario.ci,
          complemento: '',
        },
        nombre: {
          nombres: usuario.nombres,
          primer_apellido: usuario.primerApellido,
          segundo_apellido: usuario.segundoApellido || '',
        },
      },
      fecha_nacimiento: usuario.fechaNacimiento, // DD/MM/YYYY
      email: usuario.email,
      celular: usuario.celular || '',
    }
  }
}
