import { Module } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './entities/grupo.entity';
import { Distrital } from '../distritales/entities/distritale.entity';
import { Unidad } from '../unidades/entities/unidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, Distrital, Unidad])],
  controllers: [GruposController],
  providers: [GruposService],
  exports: [TypeOrmModule],
})
export class GruposModule {}
