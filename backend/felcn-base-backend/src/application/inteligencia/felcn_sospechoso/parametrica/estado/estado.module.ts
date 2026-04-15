import { Module } from '@nestjs/common';
import { EstadoService } from './estado.service';
import { EstadoController } from './estado.controller';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estado } from './entities/estado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estado], DB_SOSPECHOSO),
  ],
  controllers: [EstadoController],
  providers: [EstadoService],
  exports: [EstadoService],
})
export class EstadoModule {}
