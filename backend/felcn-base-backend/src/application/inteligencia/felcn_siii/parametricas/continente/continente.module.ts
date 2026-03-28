import { Module } from '@nestjs/common';
import { ContinenteService } from './continente.service';
import { ContinenteController } from './continente.controller';
import { Continente } from './entities/continente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_SIII } from '@/core/config/database/database.module';

@Module({
  imports:[TypeOrmModule.forFeature([Continente], DB_SIII)],
  controllers: [ContinenteController],
  providers: [ContinenteService],
  exports: [ContinenteService],
})
export class ContinenteModule {}
