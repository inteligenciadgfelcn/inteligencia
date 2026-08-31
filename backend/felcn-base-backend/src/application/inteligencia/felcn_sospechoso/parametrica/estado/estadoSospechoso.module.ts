import { Module } from '@nestjs/common';
import { EstadoSospechosoController } from './estadoSospechoso.controller';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoSospechoso } from './entities/estadoSospechoso.entity';
import { EstadoSospechosoService } from './estadoSospechoso.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadoSospechoso], DB_SOSPECHOSO),
  ],
  controllers: [EstadoSospechosoController],
  providers: [EstadoSospechosoService],
  exports: [EstadoSospechosoService],
})
export class EstadoSospechosoModule {}
