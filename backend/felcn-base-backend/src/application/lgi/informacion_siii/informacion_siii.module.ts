import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_SIII } from '@/application/sunesis/shared/constants'
import { SiiiModule } from '@/application/sunesis/siii/siii.module'
import { AsignacionSiii } from '@/application/sunesis/siii/asignacion/entity/asignacion-siii.entity'
import { InformacionSiiiService } from './informacion_siii.service'
import { InformacionSiiiController } from './informacion_siii.controller'

@Module({
  imports: [TypeOrmModule.forFeature([AsignacionSiii], DB_SIII), SiiiModule],
  controllers: [InformacionSiiiController],
  providers: [InformacionSiiiService],
  exports: [InformacionSiiiService],
})
export class InformacionSiiiModule {}
