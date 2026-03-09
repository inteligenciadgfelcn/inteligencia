import { Module } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { DB_ASIG_CASOS, DB_SIII } from '@/core/config/database/database.module';
import { ServicioController } from './servicio.controller';
import { Usuario } from '../../felcn_siii/parametricas/usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Servicio], DB_ASIG_CASOS), 
  TypeOrmModule.forFeature([Usuario], DB_SIII),],
  controllers: [ServicioController],
  providers: [ServicioService],
  exports: [TypeOrmModule],
})
export class ServicioModule {}
