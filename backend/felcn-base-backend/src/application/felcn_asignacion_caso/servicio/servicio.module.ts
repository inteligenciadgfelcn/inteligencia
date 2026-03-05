import { Module } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { DB_ASIG_CASOS } from '@/core/config/database/database.module';
import { ServicioController } from './servicio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio], DB_ASIG_CASOS)],
  controllers: [ServicioController],
  providers: [ServicioService],
  exports: [TypeOrmModule],
})
export class ServicioModule {}
