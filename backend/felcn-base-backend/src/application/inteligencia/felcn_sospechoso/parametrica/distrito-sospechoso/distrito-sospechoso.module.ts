import { Module } from '@nestjs/common';
import { DistritoSospechosoService } from './distrito-sospechoso.service';
import { DistritoSospechosoController } from './distrito-sospechoso.controller';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistritoSospechoso } from './entities/distrito-sospechoso.entity';
import { UnidadSospechoso } from '../unidad-sospechoso/entities/unidad.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DistritoSospechoso, UnidadSospechoso], DB_SOSPECHOSO)],
  controllers: [DistritoSospechosoController],
  providers: [DistritoSospechosoService],
})
export class DistritoSospechosoModule {}
