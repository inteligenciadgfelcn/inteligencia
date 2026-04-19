import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { PaisController } from './pais.controller';
import { Pais } from './entities/pais.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_SII } from '@/core/config/database/database.module';
import { Continente } from '../continente/entities/continente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pais, Continente], DB_SII)],
  controllers: [PaisController],
  providers: [PaisService],
  exports: [PaisService],
})
export class PaisModule {}
