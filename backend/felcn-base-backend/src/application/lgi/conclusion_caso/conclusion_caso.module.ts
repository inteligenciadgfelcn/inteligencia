import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CasoCicloLgi } from './entities/caso-ciclo-lgi.entity'
import { CasoVerboRectorLgi } from './entities/caso-verbo-rector-lgi.entity'
import { CasoTipologiaLgi } from './entities/caso-tipologia-lgi.entity'
import { ConclusionCasoRepository } from './repository/conclusion_caso.repository'
import { ConclusionCasoService } from './conclusion_caso.service'
import { ConclusionCasoController } from './conclusion_caso.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        CasoCicloLgi,
        CasoVerboRectorLgi,
        CasoTipologiaLgi,
      ],
      DB_LGI
    ),
  ],
  controllers: [ConclusionCasoController],
  providers: [
    ConclusionCasoRepository,
    ConclusionCasoService,
  ],
  exports: [ConclusionCasoService],
})
export class ConclusionCasoModule {}