import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/common/interfaces/user.interface';

interface JwtPayload {
  sub: string;
  user: {
    nombre: string;
    usuario: string;
    rol: string;
    id_funcionario: string;
  };
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }
  // eslint-disable-next-line
  async validate(payload: JwtPayload): Promise<User> {
    return {
      userId: Number(payload.sub),
      user: payload.user.usuario,
      name: payload.user.nombre,
      role: Number(payload.user.rol),
      id_funcionario: Number(payload.user.id_funcionario),
    };
  }
}
