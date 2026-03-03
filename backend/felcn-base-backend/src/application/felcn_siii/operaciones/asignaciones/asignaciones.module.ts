import { Module } from '@nestjs/common';

import { AsignacionesService } from './asignaciones.service';
import { AsignacionesController } from './asignaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignacion } from './entities/asignacione.entity';
import { Grupo } from '@/application/felcn_s2i/grupo/entities/grupo.entity';
import { DB_S2I, DB_SIII } from '@/core/config/database/database.module';
import { Departamento } from '../../parametricas/departamento/entities/departamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asignacion,Departamento], DB_SIII),
    TypeOrmModule.forFeature([Grupo], DB_S2I),
  ],
  providers: [AsignacionesService],
  controllers: [AsignacionesController],
})
export class AsignacionesModule {}
