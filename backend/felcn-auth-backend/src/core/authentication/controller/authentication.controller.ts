import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { Issuer } from 'openid-client'
import { CookieService } from '@/common/lib/cookie.service'
import { Configurations } from '@/common/params'
import { BaseController } from '@/common/base'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { OidcAuthGuard } from '../guards/oidc-auth.guard'
import { AuthenticationService } from '../service/authentication.service'
import { RefreshTokensService } from '../service/refreshTokens.service'
import { OtpService } from '../service/otp.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { ConfigService } from '@nestjs/config'
import { AuthDto, CambioRolDto, VerificarOtpDto } from '../dto/index.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller()
@ApiTags('Autenticación')
export class AuthenticationController extends BaseController {
  constructor(
    private autenticacionService: AuthenticationService,
    private refreshTokensService: RefreshTokensService,
    private otpService: OtpService,
    @Inject(ConfigService) private configService: ConfigService
  ) {
    super()
  }

  @ApiOperation({ summary: 'Paso 1 — Autenticación con usuario y contraseña' })
  @ApiBody({ description: 'Autenticación de usuarios', type: AuthDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso (sin 2FA) — devuelve access_token y datos del usuario',
  })
  @ApiResponse({
    status: 202,
    description: 'Credenciales correctas pero se requiere verificación OTP (2FA habilitado)',
  })
  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new BadRequestException(
        `Es necesario que esté autenticado para consumir este recurso.`
      )
    }

    // Verificar si el usuario tiene 2FA habilitado (salvo que este navegador
    // ya sea un dispositivo de confianza vigente para este mismo usuario)
    const tokenConfianza = req.cookies?.[Configurations.OTP_CONFIANZA_COOKIE]
    const resultadoOtp = await this.otpService.iniciarOtp(
      req.user.id,
      tokenConfianza
    )

    if (resultadoOtp.necesita) {
      return res.status(202).json({
        finalizado: true,
        mensaje: 'Verificación en dos pasos requerida',
        datos: {
          requiereOtp: true,
          otpSesionId: resultadoOtp.otpSesionId,
          destinoOfuscado: resultadoOtp.destinoOfuscado,
          canal: resultadoOtp.canal,
        },
      })
    }

    // Sin 2FA — flujo directo (comportamiento existente)
    const result = await this.autenticacionService.autenticar(req.user)
    const refreshToken = result.refresh_token.id
    return res
      .cookie(
        this.configService.get('REFRESH_TOKEN_NAME') || '',
        refreshToken,
        CookieService.makeConfig(this.configService)
      )
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: result.data })
  }

  @ApiOperation({ summary: 'Paso 2 — Verificación del código OTP (2FA)' })
  @ApiBody({ description: 'ID de sesión OTP y código recibido', type: VerificarOtpDto })
  @ApiResponse({ status: 200, description: 'OTP correcto — devuelve access_token y datos del usuario' })
  @Post('auth/otp')
  async verificarOtp(@Body() body: VerificarOtpDto, @Res() res: Response) {
    const result = await this.autenticacionService.autenticarConOtp(
      body.otpSesionId,
      body.codigo
    )
    const refreshToken = result.refresh_token.id
    const tokenConfianza = this.otpService.generarTokenConfianza(
      result.data.id
    )
    return res
      .cookie(
        this.configService.get('REFRESH_TOKEN_NAME') || '',
        refreshToken,
        CookieService.makeConfig(this.configService)
      )
      .cookie(
        Configurations.OTP_CONFIANZA_COOKIE,
        tokenConfianza,
        {
          httpOnly: true,
          secure: this.configService.get('REFRESH_TOKEN_SECURE') === 'true',
          expires: new Date(
            Date.now() + Configurations.OTP_CONFIANZA_HORAS * 60 * 60 * 1000
          ),
          path: this.configService.get('REFRESH_TOKEN_PATH'),
        }
      )
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: result.data })
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('cambiarRol')
  async changeRol(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CambioRolDto
  ) {
    if (!req.user) {
      throw new BadRequestException(
        `Es necesario que esté autenticado para consumir este recurso.`
      )
    }
    const result = await this.autenticacionService.cambiarRol(req.user, body)

    const refreshToken = result.refresh_token.id
    return res
      .cookie(
        this.configService.get('REFRESH_TOKEN_NAME') || '',
        refreshToken,
        CookieService.makeConfig(this.configService)
      )
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: result.data })
  }

  @ApiOperation({ summary: 'API para autenticación con ciudadania digital' })
  @UseGuards(OidcAuthGuard)
  @Get('ciudadania-auth')
  async loginCiudadania() {
    //
  }

  @ApiOperation({ summary: 'API para autorización con Ciudadanía Digital' })
  @UseGuards(OidcAuthGuard)
  @Get('ciudadania-autorizar')
  async loginCiudadaniaCallback(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.status(200).json({})
    }

    const user = req.user
    if (user.error) {
      return await this.logoutCiudadania(req, res, user.error)
    }

    try {
      const result = await this.autenticacionService.autenticarOidc(req.user)

      const refreshToken = result.refresh_token.id

      return res
        .cookie(
          this.configService.get('REFRESH_TOKEN_NAME') || '',
          refreshToken,
          CookieService.makeConfig(this.configService)
        )
        .status(200)
        .json({
          access_token: result.data.access_token,
        })
    } catch (error) {
      this.logger.error('[ciudadania-autorizar] Error en autenticación ', error)
      await this.logoutCiudadania(req, res, error.message)
    }
  }

  @ApiOperation({ summary: 'API para logout digital' })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get('logout')
  async salirCiudadania(@Req() req: Request, @Res() res: Response) {
    await this.logoutCiudadania(req, res)
  }

  async logoutCiudadania(
    @Req() req: Request,
    @Res() res: Response,
    mensaje = ''
  ) {
    const refreshTokenName = this.configService.get('REFRESH_TOKEN_NAME') || 'jid'
    const jid = req.cookies[refreshTokenName] || ''
    if (jid) {
      await this.refreshTokensService.removeByid(jid)
    }

    const idToken =
      req.user?.idToken || req.session?.passport?.user?.idToken || null

    // req.logout();
    req.session.destroy(() => ({}))
    res.clearCookie('connect.sid')
    res.clearCookie(refreshTokenName, { path: this.configService.get('REFRESH_TOKEN_PATH') || '/' })

    let idUsuario: string | null = null
    try {
      const parts = req.headers.authorization?.split('.')
      if (parts && parts.length >= 2) {
        idUsuario = JSON.parse(Buffer.from(parts[1], 'base64').toString()).id ?? null
      }
    } catch {
      // token malformado o ausente — continúa sin id de auditoría
    }

    this.logger.audit('authentication', {
      mensaje: 'Salió del sistema',
      metadata: { usuario: idUsuario },
    })

    // Ciudadanía v2: solo si el usuario entró por OIDC
    if (!idToken) {
      return res.status(200).json({})
    }

    const issuer = await Issuer.discover(
      this.configService.get('OIDC_ISSUER') || ''
    )
    const urlEndSession = issuer.metadata.end_session_endpoint

    if (!urlEndSession) {
      return res.status(200).json()
    }

    const urlResponse = new URL(urlEndSession)

    urlResponse.searchParams.append(
      'post_logout_redirect_uri',
      this.configService.get('OIDC_POST_LOGOUT_REDIRECT_URI') ?? ''
    )
    urlResponse.searchParams.append('id_token_hint', idToken)
    urlResponse.searchParams.append('mensaje', mensaje)

    return res.status(200).json({
      url: urlResponse.toString(),
    })
  }
}
