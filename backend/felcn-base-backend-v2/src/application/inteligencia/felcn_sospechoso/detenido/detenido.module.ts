import { Module } from '@nestjs/common';
import { DetenidoService } from './detenido.service';
import { DetenidoController } from './detenido.controller';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { Detenido } from './entities/detenido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [
      TypeOrmModule.forFeature(
        [Detenido],
        DB_SOSPECHOSO, 
      ),
    ],
  controllers: [DetenidoController],
  providers: [DetenidoService],
})
export class DetenidoModule {}
