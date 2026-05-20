import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OidcController } from './oidc.controller'
import { OidcService } from './oidc.service'
import { JwtService } from './jwt.service'
import { CiudadaniaSession } from '../database/entities/ciudadania-session.entity'
import { CiudadaniaUsuario } from '../database/entities/ciudadania-usuario.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CiudadaniaSession, CiudadaniaUsuario])],
  controllers: [OidcController],
  providers: [OidcService, JwtService],
  exports: [OidcService, JwtService],
})
export class OidcModule {}
