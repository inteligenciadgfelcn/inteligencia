import { Module } from '@nestjs/common';
import { PersonasImplicadasPdService } from './personas_implicadas_pd.service';
import { PersonasImplicadasPdController } from './personas_implicadas_pd.controller';
import { PersonasImplicadasPdRepository } from './repository/personas_implicadas.repository';
import { PersonasImplicada } from '@/application/lgi/personas_implicadas/entities/personas_implicada.entity';
import { SituacionJuridica } from '@/application/lgi/situacion_juridica/entities/situacion_juridica.entity';
import { DB_LGI } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      TypeOrmModule.forFeature(
        [
          PersonasImplicada,
          SituacionJuridica,
        ],
        DB_LGI,
      ),
    ],
  controllers: [PersonasImplicadasPdController],
  providers: [PersonasImplicadasPdService, PersonasImplicadasPdRepository],
   exports: [PersonasImplicadasPdService, PersonasImplicadasPdRepository],
})
export class PersonasImplicadasPdModule {}
