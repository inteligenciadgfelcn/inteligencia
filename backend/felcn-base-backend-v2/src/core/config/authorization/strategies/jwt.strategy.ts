import { LoggerService } from '@/core/logger'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  protected logger = LoggerService.getInstance()

  constructor(private configService: ConfigService) {
    console.log('🔥 JWT STRATEGY CARGADA')
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    })
  }

  // passReqToCallback:true agrega `req` como primer parámetro para poder recuperar el
  // bearer token crudo: el payload decodificado no lo trae, y lo necesitamos para poder
  // reenviarlo a felcn-auth-backend (ej. ReportBaseService.obtenerUsuarioGenerador).
  validate(req: Request, payload: PayloadType): PassportUser {
    return {
      id: payload.id,
      usuario: payload.usuario,
      roles: payload.roles,
      idRol: payload.idRol,
      rol: payload.rol,
      numeroPase: payload.numeroPase,
      exp: payload.exp,
      iat: payload.iat,
      accessToken: ExtractJwt.fromAuthHeaderAsBearerToken()(req) ?? undefined,
    }
  }
}
