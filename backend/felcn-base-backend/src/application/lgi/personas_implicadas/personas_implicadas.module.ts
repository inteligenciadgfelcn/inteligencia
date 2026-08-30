import { Module } from '@nestjs/common';
import { PersonasImplicadasService } from './personas_implicadas.service';
import { PersonasImplicadasController } from './personas_implicadas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonasImplicadasLgiRepository } from './repository/personas_implicadas.repository';
import { PersonasImplicada } from './entities/personas_implicada.entity';
import { DB_LGI } from '@/core/config/database/database.module';
import { SituacionJuridica } from '../situacion_juridica/entities/situacion_juridica.entity';

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
  controllers: [
    PersonasImplicadasController,
  ],
  providers: [
    PersonasImplicadasService,
    PersonasImplicadasLgiRepository,
  ],
  exports: [
    PersonasImplicadasService,
    PersonasImplicadasLgiRepository,
  ],
})
export class PersonasImplicadasModule {}
