import { Module } from '@nestjs/common';
import { DistritalService } from './distrital.service';
import { DistritalController } from './distrital.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Distrital } from './entities/distrital.entity';
import { Unidad } from '../unidad/entities/unidad.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Distrital, Unidad])],
  controllers: [DistritalController],
  providers: [DistritalService],
  exports: [TypeOrmModule],
})
export class DistritalModule {}
