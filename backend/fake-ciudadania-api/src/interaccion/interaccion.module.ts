import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InteraccionController } from './interaccion.controller'
import { InteraccionService } from './interaccion.service'
import { EmailService } from './email.service'
import { CiudadaniaUsuario } from '../database/entities/ciudadania-usuario.entity'
import { CiudadaniaOtp } from '../database/entities/ciudadania-otp.entity'
import { OidcModule } from '../oidc/oidc.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([CiudadaniaUsuario, CiudadaniaOtp]),
    OidcModule,
  ],
  controllers: [InteraccionController],
  providers: [InteraccionService, EmailService],
})
export class InteraccionModule {}
