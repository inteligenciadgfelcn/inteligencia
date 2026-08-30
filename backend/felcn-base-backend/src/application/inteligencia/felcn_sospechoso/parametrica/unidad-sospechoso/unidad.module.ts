import { Module } from '@nestjs/common';
import { UnidadSospechosoService } from './unidad.service';
import { UnidadSospechosoController } from './unidad.controller';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { UnidadSospechoso } from './entities/unidad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [TypeOrmModule.forFeature([UnidadSospechoso], DB_SOSPECHOSO)],
  controllers: [UnidadSospechosoController],
  providers: [UnidadSospechosoService],
})
export class UnidadSospechosoModule {}
