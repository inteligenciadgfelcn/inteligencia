import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AsignacionesService } from './asignaciones.service';
import { AsignacionesController } from './asignaciones.controller';

import { Asignacion } from './entities/asignacione.entity';
import { Departamento } from 'src/modules/parametros/departamentos/entities/departamento.entity';
import { Grupo } from 'src/modules/usuario/grupos/entities/grupo.entity';
import { Letra } from 'src/modules/parametros/letras/entities/letra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asignacion, Departamento, Grupo, Letra])],
  controllers: [AsignacionesController],
  providers: [AsignacionesService],
  exports: [AsignacionesModule],
})
export class AsignacionesModule {}
