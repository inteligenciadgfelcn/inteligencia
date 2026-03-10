import { Module } from '@nestjs/common';
import { AliasDetenidoService } from './alias_detenido.service';
import { AliasDetenidoController } from './alias_detenido.controller';
import { DB_SIII } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alias } from 'typeorm/query-builder/Alias';

@Module({
  imports: [
        TypeOrmModule.forFeature([Alias], DB_SIII),
      ],
  controllers: [AliasDetenidoController],
  providers: [AliasDetenidoService],
})
export class AliasDetenidoModule {}
