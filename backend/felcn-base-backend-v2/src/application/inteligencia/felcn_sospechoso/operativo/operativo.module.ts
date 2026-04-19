import { Module } from '@nestjs/common';
import { OperativoService } from './operativo.service';
import { OperativoController } from './operativo.controller';
import { SiiiRepository } from './repositories/siii.repository';
import { AuthRepository } from './repositories/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from '../parametrica/provincia/entities/departamento.entity';
import { Operativo } from './entities/operativo.entity';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Operativo, Departamento],
      DB_SOSPECHOSO, 
    ),
  ],
  controllers: [OperativoController],
  providers: [OperativoService, SiiiRepository, AuthRepository],
   exports: [OperativoService],
})
export class OperativoModule {}
