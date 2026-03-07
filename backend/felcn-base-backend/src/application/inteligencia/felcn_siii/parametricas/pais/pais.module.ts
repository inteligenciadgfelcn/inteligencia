import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { PaisController } from './pais.controller';
import { Continente } from '../continente/entities/continente.entity';
import { Pais } from './entities/pais.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_SIII } from '@/core/config/database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pais, Continente], DB_SIII)],
  controllers: [PaisController],
  providers: [PaisService],
  exports: [PaisService],
})
export class PaisModule {}
