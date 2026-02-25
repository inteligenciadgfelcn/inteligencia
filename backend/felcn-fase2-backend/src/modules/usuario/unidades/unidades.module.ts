import { Module } from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { UnidadesController } from './unidades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unidad } from './entities/unidade.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Unidad])],
  controllers: [UnidadesController],
  providers: [UnidadesService],
  exports: [UnidadesService],
})
export class UnidadesModule {}
