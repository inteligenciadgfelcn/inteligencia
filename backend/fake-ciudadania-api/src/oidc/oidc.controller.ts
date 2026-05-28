import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { OidcService } from './oidc.service'
import { JwtService } from './jwt.service'

@Controller()
export class OidcController {
  constructor(
    private readonly oidcService: OidcService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * OIDC Discovery endpoint.
   * openid-client hace GET a este endpoint para descubrir los endpoints del proveedor.
   */
  @Get('.well-known/openid-configuration')
  discovery() {
    const issuer = process.env.FAKE_ISSUER || 'http://localhost:3001'
    return {
      issuer,
      authorization_endpoint: `${issuer}/auth`,
      token_endpoint: `${issuer}/token`,
      userinfo_endpoint: `${issuer}/me`,
      jwks_uri: `${issuer}/jwks`,
      end_session_endpoint: `${issuer}/session/end`,
      response_types_supported: ['code'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      scopes_supported: ['openid', 'profile', 'email', 'fecha_nacimiento', 'celular', 'offline_access'],
      token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
      claims_supported: [
        'sub', 'iss', 'aud', 'exp', 'iat', 'nonce',
        'profile', 'email', 'fecha_nacimiento', 'celular',
      ],
      code_challenge_methods_supported: [],
    }
  }

  /** JWKS — claves públicas para verificar los tokens */
  @Get('jwks')
  jwks() {
    return this.jwtService.getJwks()
  }

  /**
   * Authorization endpoint.
   * El auth-backend redirige aquí con los parámetros OIDC.
   * Creamos la sesión y redirigimos a la página de login.
   */
  @Get('auth')
  async authorize(@Req() req: Request, @Res() res: Response) {
    const { client_id, redirect_uri, state, nonce, scope, response_type } = req.query as Record<string, string>

    if (!client_id || !redirect_uri || !response_type) {
      throw new BadRequestException('Faltan parámetros requeridos: client_id, redirect_uri, response_type')
    }

    const uid = await this.oidcService.crearSession({
      client_id,
      redirect_uri,
      state: state || '',
      nonce: nonce || '',
      scope: scope || 'openid',
    })

    return res.redirect(`/interaction/${uid}`)
  }

  /**
   * Token endpoint.
   * El auth-backend intercambia el authorization_code por access_token + id_token.
   */
  @Post('token')
  @HttpCode(HttpStatus.OK)
  async token(@Req() req: Request) {
    const body = req.body as Record<string, string>
    const { grant_type, code, client_id, client_secret, redirect_uri } = body

    if (grant_type !== 'authorization_code') {
      throw new BadRequestException('grant_type debe ser authorization_code')
    }

    if (!code) {
      throw new BadRequestException('Falta el parámetro code')
    }

    // Validar client credentials
    const expectedClientId = process.env.OIDC_CLIENT_ID || 'fake-ciudadania-client'
    const expectedClientSecret = process.env.OIDC_CLIENT_SECRET || 'fake-ciudadania-secret'

    // Soporte para Basic Auth y body params
    let resolvedClientId = client_id
    let resolvedClientSecret = client_secret
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Basic ')) {
      const decoded = Buffer.from(authHeader.slice(6), 'base64').toString()
      const [id, secret] = decoded.split(':')
      resolvedClientId = id
      resolvedClientSecret = secret
    }

    if (resolvedClientId !== expectedClientId || resolvedClientSecret !== expectedClientSecret) {
      throw new UnauthorizedException('Credenciales de cliente inválidas')
    }

    const tokenData = await this.oidcService.intercambiarCode(code)
    return tokenData
  }

  /**
   * Userinfo endpoint.
   * El auth-backend llama aquí con el access_token para obtener los datos del usuario.
   * Devuelve exactamente la estructura que espera oidc.strategy.ts
   */
  @Get('me')
  async userinfo(@Req() req: Request) {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Se requiere Bearer token')
    }
    const token = authHeader.slice(7)
    return this.oidcService.getUserinfo(token)
  }

  /** Logout endpoint */
  @Get('session/end')
  async sessionEnd(@Res() res: Response, @Req() req: Request) {
    const { post_logout_redirect_uri } = req.query as Record<string, string>
    const redirectUri = post_logout_redirect_uri || process.env.FAKE_ISSUER || 'http://localhost:3001'
    return res.redirect(redirectUri)
  }
}
