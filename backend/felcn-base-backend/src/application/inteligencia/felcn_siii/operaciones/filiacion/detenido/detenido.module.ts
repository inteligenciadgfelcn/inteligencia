import { Module } from '@nestjs/common';
import { DetenidoService } from './detenido.service';
import { DetenidoController } from './detenido.controller';
import { Detenido } from './entities/detenido.entity';
import { DB_SIII } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pais } from '../../../parametricas/pais/entities/pais.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Detenido, Pais], DB_SIII),
    ],
  controllers: [DetenidoController],
  providers: [DetenidoService],
})
export class DetenidoModule {}
