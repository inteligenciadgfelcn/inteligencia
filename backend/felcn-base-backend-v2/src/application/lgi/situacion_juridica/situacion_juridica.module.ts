import { Module } from '@nestjs/common'
import { SituacionJuridicaService } from './situacion_juridica.service'
import { SituacionJuridicaController } from './situacion_juridica.controller'
import { DB_LGI } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SituacionJuridica } from './entities/situacion_juridica.entity'
import { SituacionJuridicaRepository } from './repository/situacion_juridica.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [SituacionJuridica],
      DB_LGI,
    ),
  ],
  controllers: [
    SituacionJuridicaController,
  ],
  providers: [
    SituacionJuridicaService,
    SituacionJuridicaRepository,
  ],
  exports: [
    SituacionJuridicaService,
  ],
})
export class SituacionJuridicaModule {}
