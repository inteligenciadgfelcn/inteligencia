import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DB_LGI } from '@/application/sunesis/shared/constants/database-connections'
import { SituacionJuridicaPdController } from './situacion_juridica_pd.controller'
import { SituacionJuridicaPdService } from './situacion_juridica_pd.service'
import { SituacionJuridicaPd } from './entities/situacion_juridica_pd.entity'
import { SituacionJuridicaPdRepository } from './repository/situacion_juridica_pd.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([SituacionJuridicaPd], DB_LGI),
  ],
  controllers: [SituacionJuridicaPdController],
  providers: [
    SituacionJuridicaPdService,
    SituacionJuridicaPdRepository,
  ],
  exports: [SituacionJuridicaPdService],
})
export class SituacionJuridicaPdModule {}