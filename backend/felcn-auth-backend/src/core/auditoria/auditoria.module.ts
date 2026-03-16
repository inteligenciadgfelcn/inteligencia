import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BitacoraLogin } from './entity/bitacora-login.entity'
import { AuditoriaCambio } from './entity/auditoria-cambio.entity'
import { BitacoraLoginRepository } from './repository/bitacora-login.repository'
import { AuditoriaCambioRepository } from './repository/auditoria-cambio.repository'
import { AuditoriaService } from './service/auditoria.service'
import { AuditoriaController } from './controller/auditoria.controller'

@Module({
  imports: [TypeOrmModule.forFeature([BitacoraLogin, AuditoriaCambio])],
  controllers: [AuditoriaController],
  providers: [
    AuditoriaService,
    BitacoraLoginRepository,
    AuditoriaCambioRepository,
  ],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}
