import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditoria } from './auditoria.entity';
import { AuditoriaAccesoInterceptor } from '../../common/interceptors/auditoria-acceso.interceptor';
import { AuditoriaSubscriber } from './auditoria.subcriber';
import { AuditoriaAcceso } from './auditoria.acceso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auditoria, AuditoriaAcceso])],
  providers: [AuditoriaSubscriber, AuditoriaAccesoInterceptor],
  exports: [],
})
export class AuditoriaModule {}