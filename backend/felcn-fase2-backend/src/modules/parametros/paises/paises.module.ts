import { Module } from '@nestjs/common';
import { PaisesService } from './paises.service';
import { PaisesController } from './paises.controller';
import { Pais } from './entities/paise.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Continente } from '../continentes/entities/continente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pais, Continente])],
  controllers: [PaisesController],
  providers: [PaisesService],
  exports: [TypeOrmModule],
})
export class PaisesModule {}
