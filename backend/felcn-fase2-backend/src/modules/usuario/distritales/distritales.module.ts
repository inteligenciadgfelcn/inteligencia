import { Module } from '@nestjs/common';
import { DistritalesService } from './distritales.service';
import { DistritalesController } from './distritales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Distrital } from './entities/distritale.entity';
import { Unidad } from '../unidades/entities/unidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Distrital, Unidad])],
  controllers: [DistritalesController],
  providers: [DistritalesService],
  exports: [TypeOrmModule],
})
export class DistritalesModule {}
