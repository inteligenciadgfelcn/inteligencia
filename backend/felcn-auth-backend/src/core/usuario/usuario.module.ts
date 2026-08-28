import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { UsuarioService } from './service/usuario.service'
import { UsuarioController } from './controller/usuario.controller'
import { SolicitudRegistroController } from './controller/solicitud-registro.controller'
import { SolicitudRegistroService } from './service/solicitud-registro.service'
import { SolicitudRegistroRepository } from './repository/solicitud-registro.repository'
import { MensajeriaModule } from '../external-services/mensajeria/mensajeria.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthorizationModule } from '../authorization/authorization.module'
import { EstructuraModule } from '../estructura/estructura.module'
import { RolRepository } from '../authorization/repository/rol.repository'
import { UsuarioRepository } from './repository/usuario.repository'
import { PersonaRepository } from './repository/persona.repository'
import { UsuarioRolRepository } from '../authorization/repository/usuario-rol.repository'
import { RefreshTokensRepository } from '../authentication/repository/refreshTokens.repository'
import { HistorialContrasenaRepository } from './repository/historial-contrasena.repository'
import { Usuario } from './entity/usuario.entity'
import { Persona } from './entity/persona.entity'
import { SolicitudRegistro } from './entity/solicitud-registro.entity'
import { UsuarioRol } from '../authorization/entity/usuario-rol.entity'
import { Rol } from '../authorization/entity/rol.entity'
import { FileValidationService } from '@/common/lib/file-validation.service'

@Module({
  providers: [
    UsuarioService,
    UsuarioRepository,
    PersonaRepository,
    UsuarioRolRepository,
    RolRepository,
    FileValidationService,
    RefreshTokensRepository,
    HistorialContrasenaRepository,
    SolicitudRegistroService,
    SolicitudRegistroRepository,
  ],
  exports: [UsuarioService],
  imports: [
    TypeOrmModule.forFeature([Usuario, Persona, UsuarioRol, Rol, SolicitudRegistro]),
    MensajeriaModule,
    ConfigModule,
    AuthorizationModule,
    EstructuraModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  // SolicitudRegistroController va antes: sus rutas ('usuarios/solicitudes-registro'
  // y sub-rutas) deben registrarse antes que el 'GET /usuarios/:id' de
  // UsuarioController, o ese comodín intercepta '/usuarios/solicitudes-registro'
  // como si fuera un id.
  controllers: [SolicitudRegistroController, UsuarioController],
})
export class UsuarioModule {}
