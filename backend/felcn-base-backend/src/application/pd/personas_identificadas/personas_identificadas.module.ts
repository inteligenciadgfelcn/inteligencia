import { Module } from '@nestjs/common'
import { PersonasIdentificadasService } from './personas_identificadas.service'
import { PersonasIdentificadasController } from './personas_identificadas.controller'
import { DB_LGI } from '@/application/sunesis/shared/constants/database-connections'
import { SituacionJuridica } from '@/application/lgi/situacion_juridica/entities/situacion_juridica.entity'
import { PersonasImplicada } from '@/application/lgi/personas_implicadas/entities/personas_implicada.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PersonasIdentificadaRepository } from './repository/personas_identificadas.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonasImplicada, SituacionJuridica], DB_LGI),
  ],
  controllers: [PersonasIdentificadasController],
  providers: [PersonasIdentificadasService, PersonasIdentificadaRepository],
  exports: [PersonasIdentificadasService, PersonasIdentificadaRepository],
})
export class PersonasIdentificadasModule {}
