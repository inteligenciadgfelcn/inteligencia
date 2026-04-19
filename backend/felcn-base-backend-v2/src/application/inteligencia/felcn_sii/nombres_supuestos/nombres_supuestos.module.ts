import { Module } from '@nestjs/common';
import { NombresSupuestosService } from './nombres_supuestos.service';
import { NombresSupuestosController } from './nombres_supuestos.controller';
import { NombresSupuesto } from './entities/nombres_supuesto.entity';
import { Detenido } from '../filiacion/detenido/entities/detenido.entity';
import { DB_SII } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [
      TypeOrmModule.forFeature([NombresSupuesto,Detenido], DB_SII),
    ],
  controllers: [NombresSupuestosController],
  providers: [NombresSupuestosService],
  exports: [NombresSupuestosService],
})
export class NombresSupuestosModule {}
