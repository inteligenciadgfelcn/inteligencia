import { Module } from '@nestjs/common';
import { DetenidoService } from './detenido.service';
import { DetenidoController } from './detenido.controller';
import { Detenido } from './entities/detenido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pais } from '../../../felcn_sii/parametricas/pais/entities/pais.entity';
import { DB_SII } from '@/core/config/database/database.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Detenido, Pais], DB_SII),
    ],
  controllers: [DetenidoController],
  providers: [DetenidoService],
})
export class DetenidoModule {}
