import { Module } from '@nestjs/common';

import { AsignacionesService } from './asignaciones.service';
import { AsignacionesController } from './asignaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignacion } from './entities/asignacione.entity';
import { DB_SIII } from '@/core/config/database/database.module';
import { Departamento } from '../../parametricas/departamento/entities/departamento.entity';
import { Grupo } from '../../parametricas/grupo/entities/grupo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asignacion,Departamento, Grupo], DB_SIII),
  ],
  providers: [AsignacionesService],
  controllers: [AsignacionesController],
})
export class AsignacionesModule {}
