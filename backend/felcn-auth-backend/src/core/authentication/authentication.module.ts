import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { UsuarioModule } from '../usuario/usuario.module'
import { AuthenticationController } from './controller/authentication.controller'
import { RefreshTokensController } from './controller/refreshTokens.controller'
import { AuthenticationService } from './service/authentication.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { OidcStrategy } from './strategies/oidc.strategy'
import { SessionSerializer } from './session.serializer'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsuarioRepository } from '../usuario/repository/usuario.repository'

import { RefreshTokensRepository } from './repository/refreshTokens.repository'
import { RefreshTokensService } from './service/refreshTokens.service'
import { MensajeriaModule } from '../external-services/mensajeria/mensajeria.module'
import { PersonaService } from '../usuario/service/persona.service'
import { UsuarioRolRepository } from '../authorization/repository/usuario-rol.repository'
import { PersonaRepository } from '../usuario/repository/persona.repository'
import { RolRepository } from '../authorization/repository/rol.repository'
import { Persona } from '../usuario/entity/persona.entity'
import { Usuario } from '../usuario/entity/usuario.entity'
import { RefreshTokens } from './entity/refreshTokens.entity'
import { UsuarioRol } from '../authorization/entity/usuario-rol.entity'
import { Rol } from '../authorization/entity/rol.entity'
import { BaseClient } from 'openid-client'
import { ClientOidcService } from './oidc.client'
import { BitacoraLogin } from './entity/bitacora-login.entity'
import { BitacoraLoginRepository } from './repository/bitacora-login.repository'
import { OtpSesion } from './entity/otp-sesion.entity'
import { OtpSesionRepository } from './repository/otp-sesion.repository'
import { OtpService } from './service/otp.service'
import { AuditoriaCambioSubscriber } from './subscriber/auditoria-cambio.subscriber'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { OidcAuthGuard } from './guards/oidc-auth.guard'

const OidcStrategyFactory = {
  provide: 'OidcStrategy',
  useFactory: async (autenticacionService: AuthenticationService) => {
    const client: BaseClient | undefined = await ClientOidcService.getInstance()
    if (client) return new OidcStrategy(autenticacionService, client)
    else return undefined
  },
  inject: [AuthenticationService],
}

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'oidc' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
    UsuarioModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      Persona,
      Usuario,
      RefreshTokens,
      UsuarioRol,
      Rol,
      BitacoraLogin,
      OtpSesion,
    ]),
    MensajeriaModule,
  ],
  controllers: [AuthenticationController, RefreshTokensController],
  providers: [
    AuthenticationService,
    PersonaService,
    RefreshTokensService,
    OtpService,
    LocalStrategy,
    JwtStrategy,
    OidcStrategyFactory,
    SessionSerializer,
    RolRepository,
    PersonaRepository,
    UsuarioRepository,
    RefreshTokensRepository,
    UsuarioRolRepository,
    BitacoraLoginRepository,
    OtpSesionRepository,
    AuditoriaCambioSubscriber,
    LocalAuthGuard,
    OidcAuthGuard,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
