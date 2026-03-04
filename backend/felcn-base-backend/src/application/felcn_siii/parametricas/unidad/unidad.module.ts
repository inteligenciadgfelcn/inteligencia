import { Module } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { UnidadController } from './unidad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unidad } from './entities/unidad.entity';
import { DB_SIII } from '@/core/config/database/database.module';

@Module({
   imports:[TypeOrmModule.forFeature([Unidad], DB_SIII)],
  controllers: [UnidadController],
  providers: [UnidadService],
  exports: [UnidadService],
})
export class UnidadModule {}
